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

        return new AuthResponse(token, saved.getId(), saved.getFirstName(),
                saved.getLastName(), saved.getInstitutionNumber(), saved.getRole());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Use the same error message whether the number doesn't exist or the
        // password is wrong — prevents attackers from enumerating valid numbers.
        User user = userRepository.findByInstitutionNumber(request.institutionNumber().trim())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid credentials."));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid credentials.");
        }

        // ── ROLE ENFORCEMENT ──────────────────────────────────────────────
        // Validate that the portal the user selected matches their actual role.
        // A student cannot log in via the Employee or Admin portal and vice versa.
        // We use the same generic error message to avoid leaking role information.
        UserRole expectedRole;
        try {
            expectedRole = UserRole.valueOf(request.expectedRole().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new InvalidCredentialsException("Invalid credentials.");
        }

        if (user.getRole() != expectedRole) {
            throw new InvalidCredentialsException("Invalid credentials.");
        }
        // ─────────────────────────────────────────────────────────────────

        String token = jwtService.generateToken(user.getInstitutionNumber(), user.getRole().name(), user.getId());

        return new AuthResponse(token, user.getId(), user.getFirstName(),
                user.getLastName(), user.getInstitutionNumber(), user.getRole());
    }

    /**
     * ADMIN cannot be self-registered via the public endpoint.
     * Admin accounts are created directly in the DB or via a future
     * admin-only provisioning endpoint.
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
