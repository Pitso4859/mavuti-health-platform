package za.ac.vut.mavuti.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.vut.mavuti.dto.AuthDtos.AuthResponse;
import za.ac.vut.mavuti.dto.AuthDtos.LoginRequest;
import za.ac.vut.mavuti.dto.AuthDtos.RegisterRequest;
import za.ac.vut.mavuti.service.AuthService;

/**
 * Public authentication endpoints, used by both students and employees.
 *
 * <p>{@code /api/v1} is used as the API prefix from the start (rather than
 * an unversioned {@code /api}) so that a future breaking change (e.g.
 * {@code /api/v2}) can be introduced without disrupting existing mobile
 * app installs or cached frontend builds still pointing at v1 - a common
 * real-world constraint once an app has external users.</p>
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
