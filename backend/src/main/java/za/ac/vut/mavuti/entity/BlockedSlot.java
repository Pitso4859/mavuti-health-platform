package za.ac.vut.mavuti.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * A single appointment slot an admin has made unavailable for booking -
 * e.g. a staff meeting from 10:00-11:00 that takes the clinic offline for
 * that hour. Distinct from a normal {@link Appointment} (no patient, no
 * status lifecycle) so the booking flow can cheaply check "is this slot
 * blocked?" without scanning patient bookings.
 *
 * <p>One row per (date, time) - admins block a whole meeting window (e.g.
 * 10:00-11:00) by creating one row per hourly slot it spans.</p>
 */
@Entity
@Table(
    name = "blocked_slot",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_blocked_slot",
        columnNames = {"blocked_date", "blocked_time"}
    ),
    indexes = @Index(name = "idx_blocked_slot_date", columnList = "blocked_date")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlockedSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blocked_date", nullable = false)
    private LocalDate blockedDate;

    @Column(name = "blocked_time", nullable = false)
    private LocalTime blockedTime;

    /** Why the slot is blocked, e.g. "Staff meeting" - shown to admins, not patients. */
    @Column(length = 200)
    private String reason;

    /** Institution number of the admin/staff member who blocked it. */
    @Column(name = "blocked_by", length = 20)
    private String blockedBy;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
