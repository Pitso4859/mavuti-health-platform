package za.ac.vut.mavuti.enums;

/**
 * Lifecycle states of a clinic appointment.
 *
 * <p>Modelled explicitly (rather than as a free-text "status" string) so
 * that invalid transitions are caught at compile time and the database
 * column can be a constrained enum type, preventing data drift such as
 * "Confirmed" vs "confirmed" vs "CONFIRMED" appearing across records.</p>
 *
 * <pre>
 *   PENDING --> CONFIRMED --> COMPLETED
 *      |             |
 *      +--> CANCELLED &lt;--+
 *      |
 *      +--> NO_SHOW (set by staff if patient does not arrive)
 * </pre>
 */
public enum AppointmentStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED,
    NO_SHOW
}
