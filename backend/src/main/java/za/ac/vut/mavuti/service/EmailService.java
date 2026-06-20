package za.ac.vut.mavuti.service;

import za.ac.vut.mavuti.entity.Appointment;
import za.ac.vut.mavuti.entity.User;

public interface EmailService {

    /** Sends the patient a confirmation email after they successfully book an appointment. */
    void sendAppointmentConfirmation(User user, Appointment appointment);

    /** Sends the patient an email when staff confirm/cancel/complete their appointment. */
    void sendStatusUpdate(User user, Appointment appointment);
}
