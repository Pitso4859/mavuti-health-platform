package za.ac.vut.mavuti.service.impl;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import za.ac.vut.mavuti.entity.Appointment;
import za.ac.vut.mavuti.entity.User;
import za.ac.vut.mavuti.service.EmailService;

import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;

/**
 * Sends transactional appointment emails via SMTP (configured through
 * {@code spring.mail.*} properties - see application.yml /
 * application-prod.yml).
 *
 * <p>Both methods are {@code @Async} (the app already has
 * {@code @EnableAsync} switched on - see
 * {@link za.ac.vut.mavuti.MavutiHealthPlatformApplication}) so a slow or
 * temporarily-down SMTP provider never delays the booking HTTP response:
 * the appointment is already committed to the database by the time the
 * email is attempted. A failure to send is logged, not thrown, for the
 * same reason - the user's booking must not appear to fail just because
 * the confirmation email didn't go out.</p>
 */
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("h:mm a");

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:Mavuti Health Clinic <no-reply@mavuti-health.onrender.com>}")
    private String fromAddress;

    @Value("${app.mail.enabled:true}")
    private boolean mailEnabled;

    @Override
    @Async
    public void sendAppointmentConfirmation(User user, Appointment appointment) {
        String subject = "Appointment Confirmed — " + appointment.getServiceType().getDisplayName();
        String body = """
                Hi %s,

                Your appointment has been booked at the Mavuti Health Clinic.

                  Service:  %s
                  Date:     %s
                  Time:     %s
                  Reason:   %s

                Please arrive 10 minutes early and bring your student/staff ID and medical aid card.
                Need to cancel? Sign in and cancel from your dashboard at least 6 hours before your slot.

                — Mavuti Health Clinic, VUT
                """.formatted(
                user.getFirstName(),
                appointment.getServiceType().getDisplayName(),
                appointment.getAppointmentDate().format(DATE_FMT),
                appointment.getAppointmentTime().format(TIME_FMT),
                (appointment.getReason() == null || appointment.getReason().isBlank()) ? "—" : appointment.getReason()
        );

        send(user.getEmail(), subject, body);
    }

    @Override
    @Async
    public void sendStatusUpdate(User user, Appointment appointment) {
        String subject = "Appointment Update — " + appointment.getStatus().name();
        String body = """
                Hi %s,

                Your appointment on %s at %s has been updated to: %s.

                — Mavuti Health Clinic, VUT
                """.formatted(
                user.getFirstName(),
                appointment.getAppointmentDate().format(DATE_FMT),
                appointment.getAppointmentTime().format(TIME_FMT),
                appointment.getStatus().name()
        );

        send(user.getEmail(), subject, body);
    }

    private void send(String to, String subject, String body) {
        if (!mailEnabled) {
            log.info("Mail disabled (app.mail.enabled=false) — skipped email to {}: {}", to, subject);
            return;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            // Never let an email failure look like a booking failure to the user -
            // the appointment is already saved by the time this runs.
            log.warn("Failed to send email to {}: {}", to, ex.getMessage());
        }
    }
}
