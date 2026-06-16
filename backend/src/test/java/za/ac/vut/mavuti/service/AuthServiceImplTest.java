package za.ac.vut.mavuti.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import za.ac.vut.mavuti.dto.AuthDtos.AuthResponse;
import za.ac.vut.mavuti.dto.AuthDtos.LoginRequest;
import za.ac.vut.mavuti.dto.AuthDtos.RegisterRequest;
import za.ac.vut.mavuti.entity.User;
import za.ac.vut.mavuti.enums.UserRole;
import za.ac.vut.mavuti.exception.DuplicateUserException;
import za.ac.vut.mavuti.exception.InvalidCredentialsException;
import za.ac.vut.mavuti.repository.UserRepository;
import za.ac.vut.mavuti.security.JwtService;
import za.ac.vut.mavuti.service.impl.AuthServiceImpl;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link AuthServiceImpl}.
 *
 * <p>Tests the key business rules:</p>
 * <ul>
 *   <li>Duplicate institution number → {@link DuplicateUserException}</li>
 *   <li>Duplicate email → {@link DuplicateUserException}</li>
 *   <li>Successful registration → JWT issued, correct fields returned</li>
 *   <li>Login with unknown institution number → {@link InvalidCredentialsException}</li>
 *   <li>Login with wrong password → same {@link InvalidCredentialsException}
 *       (same message, by design — prevents institution-number enumeration)</li>
 *   <li>ADMIN role rejected on public self-registration</li>
 * </ul>
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository    userRepository;
    @Mock private PasswordEncoder   passwordEncoder;
    @Mock private JwtService        jwtService;

    @InjectMocks
    private AuthServiceImpl authService;

    private User savedStudent;

    @BeforeEach
    void setUp() {
        savedStudent = User.builder()
                .id(1L)
                .firstName("Pitso")
                .lastName("Nkotolane")
                .email("221386653@edu.vut.ac.za")
                .institutionNumber("221386653")
                .passwordHash("$2a$12$hashedpw")
                .role(UserRole.STUDENT)
                .build();
    }

    // ── Registration ─────────────────────────────────────────────────────

    @Test
    void register_success_returnsTokenAndUserDetails() {
        when(userRepository.existsByInstitutionNumber("221386653")).thenReturn(false);
        when(userRepository.existsByEmail("221386653@edu.vut.ac.za")).thenReturn(false);
        when(passwordEncoder.encode("Student@123")).thenReturn("$2a$12$hashedpw");
        when(userRepository.save(any(User.class))).thenReturn(savedStudent);
        when(jwtService.generateToken("221386653", "STUDENT", 1L)).thenReturn("jwt.token.here");

        RegisterRequest req = new RegisterRequest(
                "Pitso", "Nkotolane", "221386653@edu.vut.ac.za",
                "0710000000", "221386653", "Student@123", "STUDENT"
        );

        AuthResponse resp = authService.register(req);

        assertThat(resp.token()).isEqualTo("jwt.token.here");
        assertThat(resp.firstName()).isEqualTo("Pitso");
        assertThat(resp.role()).isEqualTo(UserRole.STUDENT);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_duplicateInstitutionNumber_throwsDuplicateUserException() {
        when(userRepository.existsByInstitutionNumber("221386653")).thenReturn(true);

        RegisterRequest req = new RegisterRequest(
                "Pitso", "Nkotolane", "221386653@edu.vut.ac.za",
                null, "221386653", "Student@123", "STUDENT"
        );

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(DuplicateUserException.class)
                .hasMessageContaining("221386653");

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_duplicateEmail_throwsDuplicateUserException() {
        when(userRepository.existsByInstitutionNumber("221386653")).thenReturn(false);
        when(userRepository.existsByEmail("221386653@edu.vut.ac.za")).thenReturn(true);

        RegisterRequest req = new RegisterRequest(
                "Pitso", "Nkotolane", "221386653@edu.vut.ac.za",
                null, "221386653", "Student@123", "STUDENT"
        );

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(DuplicateUserException.class)
                .hasMessageContaining("email");
    }

    @Test
    void register_adminRoleRejected() {
        when(userRepository.existsByInstitutionNumber(any())).thenReturn(false);
        when(userRepository.existsByEmail(any())).thenReturn(false);

        RegisterRequest req = new RegisterRequest(
                "Hacker", "Person", "hacker@vut.ac.za",
                null, "999999999", "Hacker@123", "ADMIN"
        );

        assertThatThrownBy(() -> authService.register(req))
                .isInstanceOf(IllegalArgumentException.class);
        verify(userRepository, never()).save(any());
    }

    // ── Login ────────────────────────────────────────────────────────────

    @Test
    void login_success_returnsToken() {
        when(userRepository.findByInstitutionNumber("221386653"))
                .thenReturn(Optional.of(savedStudent));
        when(passwordEncoder.matches("Student@123", "$2a$12$hashedpw")).thenReturn(true);
        when(jwtService.generateToken("221386653", "STUDENT", 1L)).thenReturn("jwt.token.here");

        AuthResponse resp = authService.login(new LoginRequest("221386653", "Student@123"));

        assertThat(resp.token()).isEqualTo("jwt.token.here");
        assertThat(resp.institutionNumber()).isEqualTo("221386653");
    }

    @Test
    void login_unknownInstitutionNumber_throwsInvalidCredentials() {
        when(userRepository.findByInstitutionNumber("999999999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(new LoginRequest("999999999", "anyPassword")))
                .isInstanceOf(InvalidCredentialsException.class)
                .hasMessageContaining("Invalid institution number or password");
    }

    @Test
    void login_wrongPassword_throwsInvalidCredentials_withSameMessage() {
        when(userRepository.findByInstitutionNumber("221386653"))
                .thenReturn(Optional.of(savedStudent));
        when(passwordEncoder.matches("WrongPass!", "$2a$12$hashedpw")).thenReturn(false);

        InvalidCredentialsException byWrongPw = catchThrowableOfType(
                () -> authService.login(new LoginRequest("221386653", "WrongPass!")),
                InvalidCredentialsException.class
        );

        // The error message must be identical to the "user not found" case
        // to prevent institution-number enumeration attacks.
        assertThat(byWrongPw).hasMessage("Invalid institution number or password.");
    }
}
