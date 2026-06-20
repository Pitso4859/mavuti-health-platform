package za.ac.vut.mavuti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import za.ac.vut.mavuti.entity.BlockedSlot;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface BlockedSlotRepository extends JpaRepository<BlockedSlot, Long> {

    List<BlockedSlot> findByBlockedDate(LocalDate date);

    Optional<BlockedSlot> findByBlockedDateAndBlockedTime(LocalDate date, LocalTime time);

    boolean existsByBlockedDateAndBlockedTime(LocalDate date, LocalTime time);
}
