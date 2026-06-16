package za.ac.vut.mavuti.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import za.ac.vut.mavuti.enums.UserRole;

import java.time.Instant;

/**
 * Represents a registered VUT student or employee.
 *
 * <p><b>Identifier strategy:</b> {@code institutionNumber} holds either the
 * student number (e.g. {@code 221386653}) or the employee number
 * (e.g. {@code 4557545664}), and {@code role} disambiguates which it is.
 * A single column was chosen over two nullable columns
 * (studentNumber/employeeNumber) because:</p>
 * <ul>
 *   <li>Every user has <i>exactly one</i> institution number regardless of
 *       role - two nullable columns would require an application-level
 *       invariant ("exactly one of these two must be non-null") that the
 *       database cannot itself enforce cleanly.</li>
 *   <li>All lookups (login, "find by institution number") become a single
 *       indexed query instead of a conditional one.</li>
 * </ul>
 *
 * <p>The unique constraint on {@code institutionNumber} also prevents a
 * student and an employee from accidentally registering with the same
 * number, which would be ambiguous at login time.</p>
 */
@Entity
@Table(name = "app_user", uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_institution_number", columnNames = "institution_number"),
        @UniqueConstraint(name = "uk_user_email", columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", nullable = false, length = 80)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 80)
    private String lastName;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 20)
    private String phone;

    /**
     * Student number OR employee number depending on {@link #role}.
     * e.g. STUDENT -> "221386653", EMPLOYEE -> "4557545664".
     */
    @Column(name = "institution_number", nullable = false, length = 20)
    private String institutionNumber;

    /** BCrypt hash - the plaintext password is never persisted or logged. */
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
