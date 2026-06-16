package za.ac.vut.mavuti.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

/**
 * A message submitted via the public "Contact Us" form.
 *
 * <p>Deliberately NOT linked to {@link User} via a foreign key: the contact
 * form on the original {@code contact.html} is usable without being
 * logged in (general enquiries, prospective students, visitors). Forcing a
 * user account here would re-create the exact friction the original static
 * site avoided. The {@code senderEmail} field is captured as free text and
 * validated at the DTO layer instead.</p>
 */
@Entity
@Table(name = "contact_message")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String senderName;

    @Column(nullable = false, length = 150)
    private String senderEmail;

    @Column(length = 200)
    private String subject;

    @Column(nullable = false, length = 2000)
    private String message;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        this.createdAt = Instant.now();
    }
}
