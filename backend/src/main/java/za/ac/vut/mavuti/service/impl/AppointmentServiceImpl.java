package za.ac.vut.mavuti.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.vut.mavuti.dto.AppointmentDtos.AppointmentResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockSlotRangeRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockSlotRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockedSlotResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BookAppointmentRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.SlotAvailability;
import za.ac.vut.mavuti.entity.Appointment;
import za.ac.vut.mavuti.entity.BlockedSlot;
import za.ac.vut.mavuti.entity.User;
import za.ac.vut.mavuti.enums.AppointmentStatus;
import za.ac.vut.mavuti.exception.ResourceNotFoundException;
import za.ac.vut.mavuti.exception.SlotUnavailableException;
import za.ac.vut.mavuti.repository.AppointmentRepository;
import za.ac.vut.mavuti.repository.BlockedSlotRepository;
import za.ac.vut.mavuti.repository.UserRepository;
import za.ac.vut.mavuti.service.AppointmentService;
import za.ac.vut.mavuti.service.EmailService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Implements appointment booking, listing, cancellation, the staff-facing
 * daily schedule, and admin slot blocking.
 *
 * <p><b>Capacity model:</b> each hourly slot ({@link #CLINIC_SLOTS}) holds
 * up to {@link #SLOT_CAPACITY} (20) bookings rather than just one. Booking
 * checks, in order: (1) is the slot in the past, (2) has an admin blocked
 * it, (3) is it already at capacity. Each check happens inside the same
 * {@code @Transactional} method as the insert, so the "count, then insert"
 * race window is as small as practically possible for a system at this
 * scale; a {@code SELECT ... FOR UPDATE} on a slot-counter row would close
 * it completely if ever needed under heavier concurrent load.</p>
 */
@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    /** The clinic's bookable hourly slots, matching the frontend's time-slot grid. */
    public static final List<LocalTime> CLINIC_SLOTS = List.of(
            LocalTime.of(8, 0), LocalTime.of(9, 0), LocalTime.of(10, 0), LocalTime.of(11, 0),
            LocalTime.of(13, 0), LocalTime.of(14, 0), LocalTime.of(15, 0), LocalTime.of(16, 0)
    );

    private final AppointmentRepository appointmentRepository;
    private final BlockedSlotRepository blockedSlotRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Override
    @Transactional
    public AppointmentResponse book(Long userId, BookAppointmentRequest request) {
        LocalDate date = request.appointmentDate();
        LocalTime time = request.appointmentTime();

        if (date.isEqual(LocalDate.now()) && !time.isAfter(LocalTime.now())) {
            throw new SlotUnavailableException("That time slot has already passed today. Please choose a future time.");
        }

        if (blockedSlotRepository.existsByBlockedDateAndBlockedTime(date, time)) {
            throw new SlotUnavailableException("This time slot is unavailable. Please choose another.");
        }

        long activeBookings = appointmentRepository.countActiveBookingsForSlot(date, time);
        if (activeBookings >= SLOT_CAPACITY) {
            throw new SlotUnavailableException("This time slot is fully booked. Please choose another.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Appointment appointment = Appointment.builder()
                .user(user)
                .serviceType(request.serviceType())
                .appointmentDate(date)
                .appointmentTime(time)
                .reason(request.reason())
                .status(AppointmentStatus.PENDING)
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        emailService.sendAppointmentConfirmation(user, saved);

        return toResponse(saved, false);
    }

    @Override
    public List<AppointmentResponse> findMyAppointments(Long userId) {
        return appointmentRepository.findByUserIdOrderByAppointmentDateDescAppointmentTimeDesc(userId)
                .stream()
                .map(a -> toResponse(a, false))
                .toList();
    }

    @Override
    @Transactional
    public void cancel(Long userId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findByIdAndUserId(appointmentId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found."));

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }

    @Override
    public List<SlotAvailability> getSlotAvailability(LocalDate date) {
        Map<LocalTime, Long> bookedCounts = new HashMap<>();
        for (Object[] row : appointmentRepository.countActiveBookingsByTimeForDate(date)) {
            bookedCounts.put((LocalTime) row[0], (Long) row[1]);
        }

        Set<LocalTime> blockedTimes = blockedSlotRepository.findByBlockedDate(date)
                .stream()
                .map(BlockedSlot::getBlockedTime)
                .collect(Collectors.toSet());

        return CLINIC_SLOTS.stream()
                .map(slot -> {
                    int booked = bookedCounts.getOrDefault(slot, 0L).intValue();
                    boolean blocked = blockedTimes.contains(slot);
                    return new SlotAvailability(slot, booked, SLOT_CAPACITY, blocked, booked >= SLOT_CAPACITY);
                })
                .toList();
    }

    @Override
    public List<AppointmentResponse> findByDate(LocalDate date) {
        return appointmentRepository
                .findByAppointmentDateAndStatusIn(
                        date,
                        List.of(AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED)
                )
                .stream()
                .map(a -> toResponse(a, true)) // include patient name for staff view
                .toList();
    }

    @Override
    @Transactional
    public AppointmentResponse updateStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found."));

        appointment.setStatus(status);
        Appointment saved = appointmentRepository.save(appointment);

        emailService.sendStatusUpdate(saved.getUser(), saved);

        return toResponse(saved, true);
    }

    @Override
    @Transactional
    public BlockedSlotResponse blockSlot(String blockedByInstitutionNumber, BlockSlotRequest request) {
        if (blockedSlotRepository.existsByBlockedDateAndBlockedTime(request.blockedDate(), request.blockedTime())) {
            // Already blocked — return the existing block rather than erroring,
            // so re-submitting the same block is harmless.
            return blockedSlotRepository.findByBlockedDateAndBlockedTime(request.blockedDate(), request.blockedTime())
                    .map(this::toBlockedResponse)
                    .orElseThrow();
        }

        BlockedSlot blocked = BlockedSlot.builder()
                .blockedDate(request.blockedDate())
                .blockedTime(request.blockedTime())
                .reason(request.reason())
                .blockedBy(blockedByInstitutionNumber)
                .build();

        return toBlockedResponse(blockedSlotRepository.save(blocked));
    }

    @Override
    @Transactional
    public List<BlockedSlotResponse> blockSlotRange(String blockedByInstitutionNumber, BlockSlotRangeRequest request) {
        if (!request.endTime().isAfter(request.startTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        return CLINIC_SLOTS.stream()
                .filter(slot -> !slot.isBefore(request.startTime()) && slot.isBefore(request.endTime()))
                .map(slot -> blockSlot(blockedByInstitutionNumber,
                        new BlockSlotRequest(request.blockedDate(), slot, request.reason())))
                .toList();
    }

    @Override
    @Transactional
    public void unblockSlot(Long blockedSlotId) {
        if (!blockedSlotRepository.existsById(blockedSlotId)) {
            throw new ResourceNotFoundException("Blocked slot not found.");
        }
        blockedSlotRepository.deleteById(blockedSlotId);
    }

    @Override
    public List<BlockedSlotResponse> listBlockedSlots(LocalDate date) {
        return blockedSlotRepository.findByBlockedDate(date)
                .stream()
                .map(this::toBlockedResponse)
                .toList();
    }

    /**
     * Maps the entity to its API representation.
     *
     * @param includePatientName whether to expose the patient's name -
     *        {@code true} only for staff-facing views
     *        ({@link #findByDate}, {@link #updateStatus}); {@code false}
     *        for a user's own appointment list, where it would be
     *        redundant (they know who they are).
     */
    private AppointmentResponse toResponse(Appointment a, boolean includePatientName) {
        String patientName = includePatientName
                ? a.getUser().getFirstName() + " " + a.getUser().getLastName()
                : null;

        return new AppointmentResponse(
                a.getId(),
                a.getServiceType(),
                a.getServiceType().getDisplayName(),
                a.getAppointmentDate(),
                a.getAppointmentTime(),
                a.getReason(),
                a.getStatus(),
                patientName
        );
    }

    private BlockedSlotResponse toBlockedResponse(BlockedSlot b) {
        return new BlockedSlotResponse(b.getId(), b.getBlockedDate(), b.getBlockedTime(), b.getReason(), b.getBlockedBy());
    }
}
