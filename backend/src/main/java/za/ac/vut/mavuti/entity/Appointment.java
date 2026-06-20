package za.ac.vut.mavuti.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import za.ac.vut.mavuti.enums.AppointmentStatus;
import za.ac.vut.mavuti.enums.ServiceType;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

/**
 * A booked clinic appointment slot for a given user.
 *
 * <p><b>Capacity, not exclusivity:</b> each (date, time) slot can hold up
 * to {@code AppointmentServiceImpl.SLOT_CAPACITY} (20) patients - it is no
 * longer one-booking-per-slot. The capacity check happens in
 * {@link za.ac.vut.mavuti.service.impl.AppointmentServiceImpl#book} by
 * counting existing non-cancelled appointments for the slot inside the
 * same transaction. There is deliberately no DB-level unique constraint
 * on (date, time) anymore (multiple patients legitimately share a slot);
 * the small remaining race window under concurrent load at exactly the
 * 20th seat is an accepted trade-off for a clinic-scale system - a
 * `SELECT ... FOR UPDATE` on a slot-counter row would close it completely
 * if ever needed.</p>
 */
@Entity
@Table(
    name = "appointment",
    indexes = {
        @Index(name = "idx_appointment_user", columnList = "user_id"),
        @Index(name = "idx_appointment_date", columnList = "appointment_date"),
        @Index(name = "idx_appointment_date_time", columnList = "appointment_date, appointment_time")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, length = 40)
    private ServiceType serviceType;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    @Column(length = 500)
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AppointmentStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.status == null) {
            this.status = AppointmentStatus.PENDING;
        }
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = Instant.now();
    }
}
