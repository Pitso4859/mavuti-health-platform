package za.ac.vut.mavuti.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import za.ac.vut.mavuti.enums.UserRole;

/**
 * Request/response payloads for authentication endpoints.
 *
 * <p>Kept as nested static classes in one file (rather than one file per
 * DTO) because they are small, tightly related, and only ever used
 * together by {@code AuthController}. Splitting them into five
 * near-empty files would add navigation overhead without improving
 * readability - a judgment call favouring "find everything about auth
 * payloads in one place" over strict one-class-per-file convention.</p>
 */
public class AuthDtos {

    /**
     * Registration request.
     *
     * <p>{@code institutionNumber} validation differs by role:
     * a VUT <b>student number</b> is 9 digits (e.g. 221386653), while the
     * <b>employee number</b> format used here is 10 digits
     * (e.g. 4557545664). The regex below accepts 6-12 digits to
     * accommodate both without hard-coding either institution's exact
     * numbering scheme, since that is an HR/registry policy detail that
     * can change independently of this codebase.</p>
     */
    public record RegisterRequest(
            @NotBlank(message = "First name is required")
            @Size(max = 80)
            String firstName,

            @NotBlank(message = "Last name is required")
            @Size(max = 80)
            String lastName,

            @NotBlank(message = "Email is required")
            @Email(message = "Email must be valid")
            String email,

            @Pattern(regexp = "^[0-9+\\-\\s]{7,20}$", message = "Phone number is invalid")
            String phone,

            @NotBlank(message = "Institution number is required")
            @Pattern(regexp = "^\\d{6,12}$", message = "Institution number must be 6-12 digits")
            String institutionNumber,

            @NotBlank(message = "Password is required")
            @Size(min = 8, message = "Password must be at least 8 characters")
            String password,

            @NotBlank(message = "Role is required")
            String role // "STUDENT" or "EMPLOYEE" - parsed to UserRole in the service layer
    ) {}

    /**
     * Login request. Authentication is by institution number, not email -
     * this matches how a student or employee would naturally identify
     * themselves to a campus system.
     */
    public record LoginRequest(
            @NotBlank(message = "Institution number is required")
            String institutionNumber,

            @NotBlank(message = "Password is required")
            String password
    ) {}

    /**
     * Returned on successful login/registration. The JWT is opaque to the
     * frontend - it is stored and attached as a Bearer token, never
     * decoded or inspected client-side for authorization decisions
     * (all authorization is enforced server-side).
     */
    public record AuthResponse(
            String token,
            Long userId,
            String firstName,
            String lastName,
            String institutionNumber,
            UserRole role
    ) {}
}
