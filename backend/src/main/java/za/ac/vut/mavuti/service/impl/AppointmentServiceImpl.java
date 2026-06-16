package za.ac.vut.mavuti.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.vut.mavuti.dto.AppointmentDtos.AppointmentResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BookAppointmentRequest;
import za.ac.vut.mavuti.entity.Appointment;
import za.ac.vut.mavuti.entity.User;
import za.ac.vut.mavuti.enums.AppointmentStatus;
import za.ac.vut.mavuti.exception.ResourceNotFoundException;
import za.ac.vut.mavuti.exception.SlotUnavailableException;
import za.ac.vut.mavuti.repository.AppointmentRepository;
import za.ac.vut.mavuti.repository.UserRepository;
import za.ac.vut.mavuti.service.AppointmentService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Implements appointment booking, listing, cancellation, and the
 * staff-facing daily schedule.
 *
 * <p><b>Concurrency note (book):</b> the "is this slot free?" check and
 * the insert are two separate steps, which is inherently racy under
 * concurrent load. The defence-in-depth approach here is:</p>
 * <ol>
 *   <li>An application-level pre-check via
 *       {@code existsByAppointmentDateAndAppointmentTime} gives a fast,
 *       user-friendly error in the common case.</li>
 *   <li>The database-level unique constraint on
 *       {@code (appointment_date, appointment_time)} (see
 *       {@link Appointment}) is the actual source of truth - if two
 *       requests for the same slot race past step 1 simultaneously, the
 *       second {@code save()} throws
 *       {@link DataIntegrityViolationException}, which is caught here and
 *       translated into the same user-facing
 *       {@link SlotUnavailableException}.</li>
 * </ol>
 * <p>This pattern - optimistic pre-check + DB constraint as the real
 * guarantee - avoids needing a distributed lock (e.g. a Redis lock) for
 * what is, in practice, a low-collision-probability operation (one slot
 * per hour, per day).</p>
 */
@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public AppointmentResponse book(Long userId, BookAppointmentRequest request) {
        if (appointmentRepository.existsByAppointmentDateAndAppointmentTime(
                request.appointmentDate(), request.appointmentTime())) {
            throw new SlotUnavailableException("This time slot is already booked. Please choose another.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        Appointment appointment = Appointment.builder()
                .user(user)
                .serviceType(request.serviceType())
                .appointmentDate(request.appointmentDate())
                .appointmentTime(request.appointmentTime())
                .reason(request.reason())
                .status(AppointmentStatus.PENDING)
                .build();

        try {
            Appointment saved = appointmentRepository.save(appointment);
            return toResponse(saved, false);
        } catch (DataIntegrityViolationException ex) {
            // Lost the race to another request for the same slot.
            throw new SlotUnavailableException("This time slot is already booked. Please choose another.");
        }
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
    public List<LocalTime> getBookedSlots(LocalDate date) {
        return appointmentRepository.findBookedTimesForDate(date);
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
        return toResponse(saved, true);
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
}
