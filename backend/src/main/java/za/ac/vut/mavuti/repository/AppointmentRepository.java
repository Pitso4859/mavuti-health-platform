package za.ac.vut.mavuti.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import za.ac.vut.mavuti.entity.Appointment;
import za.ac.vut.mavuti.enums.AppointmentStatus;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

/**
 * Data access for {@link Appointment}.
 *
 * <p>The {@code findBookedTimesForDate} query backs the "available time
 * slots" feature on the booking form: rather than the frontend trying every
 * slot against the backend one at a time, the React app fetches the full
 * list of already-taken slots for a chosen date in a single round trip and
 * greys them out client-side. This is both faster for the user and reduces
 * request volume - an important consideration at the target scale of
 * 50,000 concurrent users, where N+1-style polling per slot would multiply
 * load needlessly.</p>
 */
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByUserIdOrderByAppointmentDateDescAppointmentTimeDesc(Long userId);

    @Query("select count(a) from Appointment a " +
           "where a.appointmentDate = :date and a.appointmentTime = :time and a.status <> 'CANCELLED'")
    long countActiveBookingsForSlot(@Param("date") LocalDate date, @Param("time") LocalTime time);

    @Query("select a.appointmentTime, count(a) from Appointment a " +
           "where a.appointmentDate = :date and a.status <> 'CANCELLED' " +
           "group by a.appointmentTime")
    List<Object[]> countActiveBookingsByTimeForDate(@Param("date") LocalDate date);

    @Query("select a.appointmentTime from Appointment a " +
           "where a.appointmentDate = :date and a.status <> 'CANCELLED'")
    List<LocalTime> findBookedTimesForDate(@Param("date") LocalDate date);

    boolean existsByAppointmentDateAndAppointmentTime(LocalDate appointmentDate, LocalTime appointmentTime);

    List<Appointment> findByAppointmentDateAndStatusIn(LocalDate date, List<AppointmentStatus> statuses);

    Optional<Appointment> findByIdAndUserId(Long id, Long userId);
}
