package za.ac.vut.mavuti.service;

import za.ac.vut.mavuti.dto.AppointmentDtos.AppointmentResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockSlotRangeRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockSlotRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockedSlotResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BookAppointmentRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.SlotAvailability;
import za.ac.vut.mavuti.enums.AppointmentStatus;

import java.time.LocalDate;
import java.util.List;

/**
 * Appointment booking and management use cases.
 *
 * <p>Split into "user-facing" methods ({@code book}, {@code findMyAppointments},
 * {@code cancel}, {@code getSlotAvailability}) and "staff-facing" methods
 * ({@code findByDate}, {@code updateStatus}, slot-blocking) to mirror the two audiences
 * defined in the brief: students/employees booking for themselves, and
 * clinic staff managing the day's schedule. Authorization for the
 * staff-facing methods is enforced via {@code @PreAuthorize} at the
 * controller layer.</p>
 */
public interface AppointmentService {

    /** Each hourly slot can hold this many bookings before it's "fully booked". */
    int SLOT_CAPACITY = 20;

    AppointmentResponse book(Long userId, BookAppointmentRequest request);

    List<AppointmentResponse> findMyAppointments(Long userId);

    void cancel(Long userId, Long appointmentId);

    /**
     * Returns capacity-aware availability for every slot on a date - how
     * many of the {@value #SLOT_CAPACITY} seats are taken, and whether an
     * admin has blocked it - so the booking form can show "Fully booked"
     * vs "Unavailable" instead of just greying everything out the same way.
     */
    List<SlotAvailability> getSlotAvailability(LocalDate date);

    /** Staff-only: full schedule for a given date, across all patients. */
    List<AppointmentResponse> findByDate(LocalDate date);

    /** Staff-only: transition an appointment's status (confirm/cancel/complete/no-show). */
    AppointmentResponse updateStatus(Long appointmentId, AppointmentStatus status);

    /** Staff/admin-only: mark a single hourly slot unavailable (e.g. a meeting). */
    BlockedSlotResponse blockSlot(String blockedByInstitutionNumber, BlockSlotRequest request);

    /** Staff/admin-only: mark every hourly slot in [startTime, endTime) unavailable in one call. */
    List<BlockedSlotResponse> blockSlotRange(String blockedByInstitutionNumber, BlockSlotRangeRequest request);

    /** Staff/admin-only: remove a block, re-opening the slot for booking. */
    void unblockSlot(Long blockedSlotId);

    /** Staff/admin-only: list all blocked slots for a date. */
    List<BlockedSlotResponse> listBlockedSlots(LocalDate date);
}
