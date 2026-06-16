package za.ac.vut.mavuti.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.ac.vut.mavuti.dto.ContactDtos.ContactMessageRequest;
import za.ac.vut.mavuti.dto.ContactDtos.ContactMessageResponse;
import za.ac.vut.mavuti.service.ContactService;

/**
 * Public "Contact Us" endpoint - usable without authentication, matching
 * the original {@code contact.html} which did not require login.
 */
@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactMessageResponse> submit(@Valid @RequestBody ContactMessageRequest request) {
        contactService.submit(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ContactMessageResponse("success", "Your message has been sent successfully!"));
    }
}
