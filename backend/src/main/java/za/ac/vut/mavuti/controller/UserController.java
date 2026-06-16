package za.ac.vut.mavuti.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.ac.vut.mavuti.entity.User;
import za.ac.vut.mavuti.exception.ResourceNotFoundException;
import za.ac.vut.mavuti.repository.UserRepository;
import za.ac.vut.mavuti.security.AuthenticatedUser;

import java.util.Map;

/**
 * Returns the authenticated user's own profile.
 *
 * <p>Deliberately the only place in the API that loads the full
 * {@link User} entity from the JWT's {@code userId} claim - everywhere
 * else, the token's claims (id, institution number, role) are sufficient
 * and a database round trip is avoided (see {@code AuthenticatedUser}).</p>
 */
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Authentication authentication) {
        Long userId = ((AuthenticatedUser) authentication.getPrincipal()).userId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "firstName", user.getFirstName(),
                "lastName", user.getLastName(),
                "email", user.getEmail(),
                "phone", user.getPhone() == null ? "" : user.getPhone(),
                "institutionNumber", user.getInstitutionNumber(),
                "role", user.getRole().name()
        ));
    }
}
