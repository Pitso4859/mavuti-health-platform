package za.ac.vut.mavuti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.vut.mavuti.entity.ContactMessage;

/**
 * Data access for {@link ContactMessage}. Intentionally minimal -
 * this is a write-heavy, read-rarely table (staff read via an admin
 * export, not a high-traffic endpoint), so no custom queries are needed
 * beyond the inherited CRUD methods.
 */
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}
