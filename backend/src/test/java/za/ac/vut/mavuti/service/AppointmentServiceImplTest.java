package za.ac.vut.mavuti.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import za.ac.vut.mavuti.dto.AppointmentDtos.AppointmentResponse;
import za.ac.vut.mavuti.dto.AppointmentDtos.BookAppointmentRequest;
import za.ac.vut.mavuti.entity.Appointment;
import za.ac.vut.mavuti.entity.User;
import za.ac.vut.mavuti.enums.AppointmentStatus;
import za.ac.vut.mavuti.enums.ServiceType;
import za.ac.vut.mavuti.enums.UserRole;
import za.ac.vut.mavuti.exception.SlotUnavailableException;
import za.ac.vut.mavuti.repository.AppointmentRepository;
import za.ac.vut.mavuti.repository.UserRepository;
import za.ac.vut.mavuti.service.impl.AppointmentServiceImpl;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link AppointmentServiceImpl}.
 *
 * <p>Focuses on the business rule that matters most for correctness under
 * concurrent load: a slot that is already booked must never be booked
 * again. The repository is mocked so this test runs in milliseconds with
 * no database, making it suitable for the CI pipeline's fast feedback
 * loop (see {@code .github/workflows/ci.yml}).</p>
 */
@ExtendWith(MockitoExtension.class)
class AppointmentServiceImplTest {

    @Mock
    private AppointmentRepository appointmentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AppointmentServiceImpl appointmentService;

    private User student;
    private BookAppointmentRequest request;

    @BeforeEach
    void setUp() {
        student = User.builder()
                .id(1L)
                .firstName("Pitso")
                .lastName("Nkotolane")
                .email("221386653@edu.vut.ac.za")
                .institutionNumber("221386653")
                .passwordHash("hashed")
                .role(UserRole.STUDENT)
                .build();

        request = new BookAppointmentRequest(
                ServiceType.GENERAL_CONSULTATION,
                LocalDate.now().plusDays(1),
                LocalTime.of(9, 0),
                "Routine check-up"
        );
    }

    @Test
    void book_succeedsWhenSlotIsFree() {
        when(appointmentRepository.existsByAppointmentDateAndAppointmentTime(
                request.appointmentDate(), request.appointmentTime())).thenReturn(false);
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(student));
        when(appointmentRepository.save(any(Appointment.class))).thenAnswer(invocation -> {
            Appointment a = invocation.getArgument(0);
            a.setId(100L);
            a.setStatus(AppointmentStatus.PENDING);
            return a;
        });

        AppointmentResponse response = appointmentService.book(1L, request);

        assertThat(response.id()).isEqualTo(100L);
        assertThat(response.status()).isEqualTo(AppointmentStatus.PENDING);
        assertThat(response.serviceType()).isEqualTo(ServiceType.GENERAL_CONSULTATION);
    }

    @Test
    void book_throwsSlotUnavailable_whenSlotAlreadyTaken() {
        when(appointmentRepository.existsByAppointmentDateAndAppointmentTime(
                request.appointmentDate(), request.appointmentTime())).thenReturn(true);

        assertThatThrownBy(() -> appointmentService.book(1L, request))
                .isInstanceOf(SlotUnavailableException.class)
                .hasMessageContaining("already booked");
    }
}
