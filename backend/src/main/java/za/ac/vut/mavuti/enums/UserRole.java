package za.ac.vut.mavuti.enums;

/**
 * Distinguishes the two account types served by the platform.
 *
 * <p>Both roles share the same login flow and JWT structure (per project
 * decision), but carry a different identifier type:</p>
 * <ul>
 *   <li>{@code STUDENT} - identified by a VUT <b>student number</b>
 *       (e.g. 221386653).</li>
 *   <li>{@code EMPLOYEE} - identified by a VUT <b>employee number</b>
 *       (e.g. 4557545664).</li>
 * </ul>
 *
 * <p>The role is embedded in the JWT as a claim and enforced server-side
 * via Spring Security's {@code @PreAuthorize} annotations - never trusted
 * from client-supplied request bodies alone. This matters because employee
 * accounts get access to the staff-only "appointment management" endpoints
 * (e.g. viewing the daily schedule, marking attendance) that student
 * accounts must never reach, even if a client request is crafted to imply
 * otherwise.</p>
 */
public enum UserRole {
    STUDENT,
    EMPLOYEE,

    /** Clinic administrative staff - superset of EMPLOYEE permissions. */
    ADMIN
}
