package za.ac.vut.mavuti.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import za.ac.vut.mavuti.dto.ContactDtos.ContactMessageRequest;
import za.ac.vut.mavuti.entity.ContactMessage;
import za.ac.vut.mavuti.repository.ContactMessageRepository;
import za.ac.vut.mavuti.service.ContactService;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactMessageRepository contactMessageRepository;

    @Override
    public void submit(ContactMessageRequest request) {
        ContactMessage entity = ContactMessage.builder()
                .senderName(request.senderName().trim())
                .senderEmail(request.senderEmail().trim().toLowerCase())
                .subject(request.subject())
                .message(request.message().trim())
                .build();

        contactMessageRepository.save(entity);

        notifyClinicStaff(entity);
    }

    /**
     * Placeholder for the staff notification email/Slack hook.
     *
     * <p>Marked {@code @Async} so the HTTP response to the user does not
     * wait on a downstream email provider's latency - the user gets an
     * immediate "message received" response, and notification dispatch
     * happens on a separate thread pool (configured via
     * {@code spring.task.execution} in {@code application.yml}). If the
     * email provider is slow or briefly down, it does not degrade the
     * contact form's perceived responsiveness.</p>
     */
    @Async
    public void notifyClinicStaff(ContactMessage message) {
        // Integration point: wire up an email provider (e.g. SendGrid, AWS SES)
        // or a Slack/Teams webhook here. Intentionally left as a no-op stub
        // for this version - the message is durably persisted regardless.
    }
}
