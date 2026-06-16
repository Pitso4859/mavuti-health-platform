package za.ac.vut.mavuti.enums;

/**
 * The medical services offered by the clinic, mirrored from the original
 * static {@code services.html} page and the appointment booking form's
 * {@code <select id="service">} options.
 *
 * <p>Kept as an enum (rather than a free-standing "services" table edited
 * via an admin UI) deliberately for v1: the catalogue changes rarely, an
 * enum is cacheable with zero database round-trips, and it guarantees the
 * appointment form's dropdown can never reference a service that does not
 * exist. If the clinic later needs to add/remove services without a
 * redeploy, this can be migrated to a {@code clinic_service} table - the
 * {@link za.ac.vut.mavuti.service.ServiceCatalogueService} interface is
 * already written against an abstraction so that change would not ripple
 * into controllers.</p>
 */
public enum ServiceType {
    GENERAL_CONSULTATION("General Consultation", "Comprehensive health assessments, diagnosis and treatment of common illnesses and injuries."),
    HEALTH_SCREENING("Health Screening", "Blood pressure, cholesterol, glucose, BMI, vision and hearing screenings."),
    MENTAL_HEALTH_COUNSELING("Mental Health Counseling", "Confidential counselling for stress, anxiety, depression and academic pressure."),
    LAB_TEST("Lab Test", "On-site laboratory diagnostics including STI testing, pregnancy testing and allergy testing."),
    IMMUNIZATION("Immunization", "Flu vaccines, HIV testing and ARV initiation/management under the 90-90-90 strategy."),
    PHARMACY("Pharmacy", "Dispensing of prescribed medication and treatment collection for students and staff.");

    private final String displayName;
    private final String description;

    ServiceType(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
