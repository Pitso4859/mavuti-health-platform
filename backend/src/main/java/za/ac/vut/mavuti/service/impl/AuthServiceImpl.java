package za.ac.vut.mavuti.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import za.ac.vut.mavuti.dto.AuthDtos.AuthResponse;
import za.ac.vut.mavuti.dto.AuthDtos.LoginRequest;
import za.ac.vut.mavuti.dto.AuthDtos.RegisterRequest;
import za.ac.vut.mavuti.entity.User;
import za.ac.vut.mavuti.enums.UserRole;
import za.ac.vut.mavuti.exception.DuplicateUserException;
import za.ac.vut.mavuti.exception.InvalidCredentialsException;
import za.ac.vut.mavuti.repository.UserRepository;
import za.ac.vut.mavuti.security.JwtService;
import za.ac.vut.mavuti.service.AuthService;

/**
 * Implements registration and login for the unified student/employee
 * account model.
 *
 * <p><b>Why one {@code AuthService} for both roles?</b> Per the project's
 * design decision, students and employees share a single login screen and
 * the same {@link User} table, differentiated only by {@link UserRole} and
 * the semantics of {@code institutionNumber} (student number vs employee
 * number). This avoids duplicating the entire auth stack (two tables, two
 * controllers, two JWT issuers) for what is, from the system's
 * perspective, the same operation: "verify credentials, issue a token with
 * a role claim". Role-specific behaviour (e.g. staff-only endpoints) is
 * handled downstream via {@code @PreAuthorize}, not by forking auth
 * itself.</p>
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByInstitutionNumber(request.institutionNumber())) {
            throw new DuplicateUserException(
                    "An account with institution number " + request.institutionNumber() + " already exists.");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new DuplicateUserException("An account with email " + request.email() + " already exists.");
        }

        UserRole role = parseRole(request.role());

        User user = User.builder()
                .firstName(request.firstName().trim())
                .lastName(request.lastName().trim())
                .email(request.email().trim().toLowerCase())
                .phone(request.phone())
                .institutionNumber(request.institutionNumber().trim())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(role)
                .build();

        User saved = userRepository.save(user);

        String token = jwtService.generateToken(saved.getInstitutionNumber(), saved.getRole().name(), saved.getId());

        return new AuthResponse(
                token,
                saved.getId(),
                saved.getFirstName(),
                saved.getLastName(),
                saved.getInstitutionNumber(),
                saved.getRole()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByInstitutionNumber(request.institutionNumber().trim())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid institution number or password."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            // Deliberately the same message as "user not found" above -
            // distinguishing the two would let an attacker enumerate valid
            // institution numbers.
            throw new InvalidCredentialsException("Invalid institution number or password.");
        }

        String token = jwtService.generateToken(user.getInstitutionNumber(), user.getRole().name(), user.getId());

        return new AuthResponse(
                token,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getInstitutionNumber(),
                user.getRole()
        );
    }

    /**
     * Parses the role string from the registration form.
     *
     * <p>{@code ADMIN} is deliberately not accepted from public
     * self-registration - admin accounts are provisioned out-of-band
     * (e.g. directly in the database or via a future admin-only endpoint)
     * to prevent anyone from registering themselves as an administrator.</p>
     */
    private UserRole parseRole(String roleStr) {
        try {
            UserRole role = UserRole.valueOf(roleStr.trim().toUpperCase());
            if (role == UserRole.ADMIN) {
                throw new IllegalArgumentException("ADMIN registration is not permitted via this endpoint.");
            }
            return role;
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Role must be either STUDENT or EMPLOYEE.");
        }
    }
}
