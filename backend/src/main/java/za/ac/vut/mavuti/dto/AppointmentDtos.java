package za.ac.vut.mavuti.dto;

import jakarta.validation.constraints.FutureOrPresent;
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
     * <p>{@code @FutureOrPresent} on {@code appointmentDate} allows booking
     * today as well as future dates - same-day slots whose time has
     * already passed are rejected separately in
     * {@link za.ac.vut.mavuti.service.impl.AppointmentServiceImpl#book}
     * (a date-only annotation can't see the time component). Enforcing
     * this server-side matters because a client-side-only check is
     * trivially bypassed by calling the API directly.</p>
     */
    public record BookAppointmentRequest(
            @NotNull(message = "Service type is required")
            ServiceType serviceType,

            @NotNull(message = "Date is required")
            @FutureOrPresent(message = "Appointment date cannot be in the past")
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

    /**
     * Per-slot availability for a given date, returned by
     * {@code GET /appointments/availability}. Replaces the old
     * "just a list of booked times" shape so the frontend can distinguish
     * a slot that's full ({@code bookedCount >= capacity}) from one an
     * admin has blocked ({@code blocked = true}) - they render
     * differently ("Fully booked" vs "Unavailable").
     */
    public record SlotAvailability(
            LocalTime time,
            int bookedCount,
            int capacity,
            boolean blocked,
            boolean full
    ) {}

    /** Admin/staff request to mark a single hourly slot unavailable, e.g. for a meeting. */
    public record BlockSlotRequest(
            @NotNull(message = "Date is required")
            LocalDate blockedDate,

            @NotNull(message = "Time is required")
            LocalTime blockedTime,

            @Size(max = 200, message = "Reason must be under 200 characters")
            String reason
    ) {}

    /**
     * Convenience request to block every hourly slot in a time range in one
     * call, e.g. "block 10:00 until 11:00" blocks the 10:00 slot (and any
     * other slots up to but excluding 11:00).
     */
    public record BlockSlotRangeRequest(
            @NotNull(message = "Date is required")
            LocalDate blockedDate,

            @NotNull(message = "Start time is required")
            LocalTime startTime,

            @NotNull(message = "End time is required")
            LocalTime endTime,

            @Size(max = 200, message = "Reason must be under 200 characters")
            String reason
    ) {}

    public record BlockedSlotResponse(
            Long id,
            LocalDate blockedDate,
            LocalTime blockedTime,
            String reason,
            String blockedBy
    ) {}
}
