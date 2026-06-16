package za.ac.vut.mavuti;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Entry point for the Mavuti Health Clinic Platform API.
 *
 * <p>This service powers the VUT student/employee health clinic system:
 * appointment booking, service catalogue browsing, contact/messaging,
 * and authenticated profile management.</p>
 *
 * <p><b>Why Spring Boot?</b> Spring Boot was chosen over alternatives
 * (Node/Express, Django, .NET) because:</p>
 * <ul>
 *   <li>Strong typing + compiled bytecode reduces a class of runtime errors
 *       that are common in dynamically typed stacks at scale (relevant
 *       experience: this directly reflects the "reducing runtime errors"
 *       work done during the O2M8-2-AI internship).</li>
 *   <li>Spring Security + Spring Data JPA give battle-tested, well-documented
 *       building blocks for auth and persistence rather than re-inventing
 *       them - critical for a system handling personal health-adjacent data
 *       (POPIA considerations).</li>
 *   <li>Embedded Tomcat + stateless JWT auth means the JAR is horizontally
 *       scalable out of the box - any number of identical pods can sit
 *       behind a load balancer, which is exactly the shape needed to serve
 *       50,000+ concurrent users (see docs/ARCHITECTURE.md).</li>
 *   <li>Mature ecosystem (Actuator, Micrometer, SpringDoc) gives production
 *       observability and API documentation "for free".</li>
 * </ul>
 *
 * <p>{@code @EnableCaching} backs the read-heavy, rarely-changing endpoints
 * (service catalogue, clinic hours) with a Redis-backed cache so the
 * database is shielded from repetitive identical reads under load.</p>
 *
 * <p>{@code @EnableAsync} allows notification dispatch (appointment
 * confirmation emails) to run off the request thread so a slow downstream
 * email provider never blocks a user-facing HTTP response.</p>
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
public class MavutiHealthPlatformApplication {

    public static void main(String[] args) {
        SpringApplication.run(MavutiHealthPlatformApplication.class, args);
    }
}
