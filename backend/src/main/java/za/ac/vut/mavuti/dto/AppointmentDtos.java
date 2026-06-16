package za.ac.vut.mavuti.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import za.ac.vut.mavuti.enums.AppointmentStatus;
import za.ac.vut.mavuti.enums.ServiceType;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Request/response payloads for the appointment booking feature.
 */
public class AppointmentDtos {

    /**
     * Submitted by a logged-in user to book a slot.
     *
     * <p>{@code @Future} on {@code appointmentDate} mirrors the client-side
     * {@code min} attribute set on the date input in the original
     * {@code appointment.html} (minimum date = today), but enforces it
     * server-side too - a client-side-only check is trivially bypassed
     * by calling the API directly.</p>
     */
    public record BookAppointmentRequest(
            @NotNull(message = "Service type is required")
            ServiceType serviceType,

            @NotNull(message = "Date is required")
            @Future(message = "Appointment date must be in the future")
            LocalDate appointmentDate,

            @NotNull(message = "Time is required")
            LocalTime appointmentTime,

            @Size(max = 500, message = "Reason must be under 500 characters")
            String reason
    ) {}

    /** Returned for a single appointment, e.g. in "my appointments" list. */
    public record AppointmentResponse(
            Long id,
            ServiceType serviceType,
            String serviceDisplayName,
            LocalDate appointmentDate,
            LocalTime appointmentTime,
            String reason,
            AppointmentStatus status,
            String patientName // populated only for staff-facing "daily schedule" view
    ) {}

    /** Staff action to change an appointment's status (confirm/cancel/complete/no-show). */
    public record UpdateStatusRequest(
            @NotNull(message = "Status is required")
            AppointmentStatus status
    ) {}
}
