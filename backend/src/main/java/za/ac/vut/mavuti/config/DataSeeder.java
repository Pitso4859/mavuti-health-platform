package za.ac.vut.mavuti.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import za.ac.vut.mavuti.entity.User;
import za.ac.vut.mavuti.enums.UserRole;
import za.ac.vut.mavuti.repository.UserRepository;

/**
 * Seeds two demo accounts on startup (dev profile only) so the system can
 * be demonstrated end-to-end - including the exact identifiers given in
 * the project brief - without manual registration:
 *
 * <ul>
 *   <li>Student number {@code 221386653} / password {@code Student@123}</li>
 *   <li>Employee number {@code 4557545664} / password {@code Employee@123}</li>
 * </ul>
 *
 * <p>{@code @Profile("dev")} ensures this NEVER runs against a production
 * database - seeding hardcoded demo credentials into production would be a
 * security issue. In production, real accounts are created via
 * {@code POST /api/v1/auth/register}.</p>
 */
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByInstitutionNumber("221386653")) {
            userRepository.save(User.builder()
                    .firstName("Pitso")
                    .lastName("Nkotolane")
                    .email("221386653@edu.vut.ac.za")
                    .phone("0710000000")
                    .institutionNumber("221386653")
                    .passwordHash(passwordEncoder.encode("Student@123"))
                    .role(UserRole.STUDENT)
                    .build());
        }

        if (!userRepository.existsByInstitutionNumber("4557545664")) {
            userRepository.save(User.builder()
                    .firstName("Clinic")
                    .lastName("Staff")
                    .email("4557545664@vut.ac.za")
                    .phone("0160000000")
                    .institutionNumber("4557545664")
                    .passwordHash(passwordEncoder.encode("Employee@123"))
                    .role(UserRole.EMPLOYEE)
                    .build());
        }
    }
}
