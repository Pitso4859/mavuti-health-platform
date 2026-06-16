package za.ac.vut.mavuti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.vut.mavuti.entity.User;

import java.util.Optional;

/**
 * Data access for {@link User}.
 *
 * <p>Login is performed by institution number (student/employee number)
 * rather than email, matching how VUT students and staff identify
 * themselves in the original requirements ("student no: 221386653 for
 * students of vut and employee no 4557545664"). Email is retained as a
 * secondary contact channel and for the "forgot password" flow.</p>
 */
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByInstitutionNumber(String institutionNumber);

    boolean existsByInstitutionNumber(String institutionNumber);

    boolean existsByEmail(String email);
}
