package za.ac.vut.mavuti.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import za.ac.vut.mavuti.enums.UserRole;

public class AuthDtos {

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
            String role
    ) {}

    /**
     * Login request.
     *
     * expectedRole is the portal the user selected (STUDENT / EMPLOYEE / ADMIN).
     * The backend validates this matches the account's actual role before
     * issuing a token — so a student number cannot authenticate via the
     * Employee or Admin portal even if credentials are correct.
     */
    public record LoginRequest(
            @NotBlank(message = "Institution number is required")
            String institutionNumber,

            @NotBlank(message = "Password is required")
            String password,

            @NotBlank(message = "Account type is required")
            String expectedRole
    ) {}

    public record AuthResponse(
            String token,
            Long userId,
            String firstName,
            String lastName,
            String institutionNumber,
            UserRole role
    ) {}
}
