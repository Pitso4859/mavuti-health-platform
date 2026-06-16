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
 * <p><b>Double-booking prevention:</b> the combination of
 * {@code appointmentDate} + {@code appointmentTime} is enforced as unique
 * by the service layer (see
 * {@link za.ac.vut.mavuti.service.impl.AppointmentServiceImpl#book}) using
 * a database-level unique constraint as the final safety net. This is
 * deliberately enforced at the database (not just in application code)
 * because under concurrent load (the 50,000-user target), two requests for
 * the same slot could race past an application-level check between the
 * "is it free?" read and the "insert" write. The unique constraint turns
 * that race into a clean, catchable {@code DataIntegrityViolationException}
 * rather than a silent double booking.</p>
 */
@Entity
@Table(
    name = "appointment",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_appointment_slot",
        columnNames = {"appointment_date", "appointment_time"}
    ),
    indexes = {
        @Index(name = "idx_appointment_user", columnList = "user_id"),
        @Index(name = "idx_appointment_date", columnList = "appointment_date")
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
