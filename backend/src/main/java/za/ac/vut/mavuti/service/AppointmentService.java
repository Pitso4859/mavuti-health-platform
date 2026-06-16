package za.ac.vut.mavuti.service;

import za.ac.vut.mavuti.dto.AppointmentDtos.AppointmentResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BookAppointmentRequest;
import za.ac.vut.mavuti.enums.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Appointment booking and management use cases.
 *
 * <p>Split into "user-facing" methods ({@code book}, {@code findMyAppointments},
 * {@code cancel}, {@code getAvailableSlots}) and "staff-facing" methods
 * ({@code findByDate}, {@code updateStatus}) to mirror the two audiences
 * defined in the brief: students/employees booking for themselves, and
 * clinic staff managing the day's schedule. Authorization for the
 * staff-facing methods is enforced via {@code @PreAuthorize} at the
 * controller layer.</p>
 */
public interface AppointmentService {

    AppointmentResponse book(Long userId, BookAppointmentRequest request);

    List<AppointmentResponse> findMyAppointments(Long userId);

    void cancel(Long userId, Long appointmentId);

    /** Returns the times already booked on a given date, for the booking form to grey out. */
    List<LocalTime> getBookedSlots(LocalDate date);

    /** Staff-only: full schedule for a given date, across all patients. */
    List<AppointmentResponse> findByDate(LocalDate date);

    /** Staff-only: transition an appointment's status (confirm/cancel/complete/no-show). */
    AppointmentResponse updateStatus(Long appointmentId, AppointmentStatus status);
}
