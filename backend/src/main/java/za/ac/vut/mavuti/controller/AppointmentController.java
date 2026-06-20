package za.ac.vut.mavuti.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.vut.mavuti.dto.AppointmentDtos.AppointmentResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockSlotRangeRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockSlotRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.BlockedSlotResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BookAppointmentRequest;
import za.ac.vut.mavuti.dto.AppointmentDtos.SlotAvailability;
import za.ac.vut.mavuti.dto.AppointmentDtos.UpdateStatusRequest;
import za.ac.vut.mavuti.security.AuthenticatedUser;
import za.ac.vut.mavuti.service.AppointmentService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * Appointment booking endpoints for authenticated students and employees,
 * plus a staff-only schedule management surface.
 *
 * <p>All endpoints here require authentication (enforced globally by
 * {@link za.ac.vut.mavuti.config.SecurityConfig}). The {@code /staff/**}
 * sub-paths additionally require {@code EMPLOYEE} or {@code ADMIN} role
 * via {@code @PreAuthorize}, reflecting that any VUT employee (not just
 * clinic staff specifically) can, per the current model, manage the
 * schedule - a finer-grained "clinic staff" role could be introduced later
 * without changing this controller's shape, only the
 * {@code @PreAuthorize} expressions.</p>
 */
@RestController
@RequestMapping("/api/v1/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<AppointmentResponse> book(
            @Valid @RequestBody BookAppointmentRequest request,
            Authentication authentication
    ) {
        Long userId = currentUserId(authentication);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.book(userId, request));
    }

    @GetMapping("/me")
    public ResponseEntity<List<AppointmentResponse>> myAppointments(Authentication authentication) {
        Long userId = currentUserId(authentication);
        return ResponseEntity.ok(appointmentService.findMyAppointments(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancel(@PathVariable Long id, Authentication authentication) {
        Long userId = currentUserId(authentication);
        appointmentService.cancel(userId, id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Returns capacity-aware availability for every slot on a given date,
     * so the React booking form can show "Fully booked" (capacity reached)
     * separately from "Unavailable" (an admin has blocked it) instead of
     * treating both the same way. Public to any authenticated user (not
     * staff-only) since a student needs this to book - it never exposes
     * which patients hold which seats, only counts.
     */
    @GetMapping("/availability")
    public ResponseEntity<Map<String, Object>> availability(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<SlotAvailability> slots = appointmentService.getSlotAvailability(date);

        // Kept for backwards compatibility with any older client still
        // reading "bookedTimes" as a flat list of fully-unavailable times.
        List<String> bookedTimes = slots.stream()
                .filter(s -> s.full() || s.blocked())
                .map(s -> s.time().toString())
                .toList();

        return ResponseEntity.ok(Map.of(
                "date", date.toString(),
                "slots", slots,
                "bookedTimes", bookedTimes
        ));
    }

    // ----------------------- Staff-only endpoints -----------------------

    /**
     * Full schedule for a date, across all patients. Restricted to
     * EMPLOYEE/ADMIN roles - a student must never see other students'
     * appointments.
     */
    @GetMapping("/staff/schedule")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<List<AppointmentResponse>> schedule(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(appointmentService.findByDate(date));
    }

    @PatchMapping("/staff/{id}/status")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<AppointmentResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request
    ) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, request.status()));
    }

    /**
     * Blocks a single hourly slot (e.g. 10:00) on a given date so it can't
     * be booked - used for staff meetings, public holidays, etc.
     */
    @PostMapping("/staff/block")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<BlockedSlotResponse> blockSlot(
            @Valid @RequestBody BlockSlotRequest request,
            Authentication authentication
    ) {
        String institutionNumber = ((AuthenticatedUser) authentication.getPrincipal()).institutionNumber();
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.blockSlot(institutionNumber, request));
    }

    /**
     * Blocks every hourly slot within [startTime, endTime) in one call -
     * e.g. {@code startTime=10:00, endTime=11:00} blocks just the 10:00
     * slot; {@code startTime=10:00, endTime=12:00} blocks 10:00 and 11:00.
     */
    @PostMapping("/staff/block-range")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<List<BlockedSlotResponse>> blockSlotRange(
            @Valid @RequestBody BlockSlotRangeRequest request,
            Authentication authentication
    ) {
        String institutionNumber = ((AuthenticatedUser) authentication.getPrincipal()).institutionNumber();
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentService.blockSlotRange(institutionNumber, request));
    }

    @DeleteMapping("/staff/block/{id}")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<Void> unblockSlot(@PathVariable Long id) {
        appointmentService.unblockSlot(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/staff/blocked")
    @PreAuthorize("hasAnyRole('EMPLOYEE', 'ADMIN')")
    public ResponseEntity<List<BlockedSlotResponse>> listBlockedSlots(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(appointmentService.listBlockedSlots(date));
    }

    private Long currentUserId(Authentication authentication) {
        return ((AuthenticatedUser) authentication.getPrincipal()).userId();
    }
}
