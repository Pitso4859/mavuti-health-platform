package za.ac.vut.mavuti.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import za.ac.vut.mavuti.enums.ServiceType;

public class ContactDtos {

    /** Maps directly to the #contact-form fields in the original contact.html. */
    public record ContactMessageRequest(
            @NotBlank(message = "Name is required")
            @Size(max = 100)
            String senderName,

            @NotBlank(message = "Email is required")
            @Email(message = "Email must be valid")
            String senderEmail,

            @Size(max = 200)
            String subject,

            @NotBlank(message = "Message is required")
            @Size(max = 2000)
            String message
    ) {}

    public record ContactMessageResponse(
            String status,
            String message
    ) {}

    /**
     * Read-only projection of {@link ServiceType} for the public services
     * page. Returned by {@code GET /api/v1/services}, cached aggressively
     * since the catalogue rarely changes (see
     * {@code ServiceCatalogueService}).
     */
    public record ServiceResponse(
            ServiceType code,
            String displayName,
            String description
    ) {}
}
