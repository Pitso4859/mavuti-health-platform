package za.ac.vut.mavuti.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import za.ac.vut.mavuti.security.JwtAuthenticationFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Central security configuration: stateless JWT auth, CORS, password
 * hashing, and the public/protected endpoint matrix.
 *
 * <p><b>Why stateless ({@code SessionCreationPolicy.STATELESS})?</b>
 * No server-side session is created or consulted - every request must
 * carry its own valid JWT. This is what allows any number of backend
 * replicas to handle any request without sticky sessions or a shared
 * session store, which is foundational to the horizontal-scaling story
 * for 50,000+ concurrent users (see {@code docs/ARCHITECTURE.md}).</p>
 *
 * <p><b>Why BCrypt?</b> BCrypt is a deliberately slow, salted hashing
 * algorithm designed for password storage (unlike fast general-purpose
 * hashes such as SHA-256). Even if the {@code app_user} table were ever
 * exfiltrated, BCrypt's cost factor makes brute-forcing passwords
 * computationally expensive. This is non-negotiable for a system storing
 * identifiers (student/employee numbers) that double as login credentials
 * for health-related bookings.</p>
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize on controller/service methods
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    /**
     * Comma-separated list of allowed frontend origins, configured per
     * environment via {@code app.cors.allowed-origins} (see
     * application-dev.yml / application-prod.yml). Using
     * {@code allowedOriginPatterns} (not {@code allowedOrigins}) lets a
     * single configured value support wildcard subdomains
     * (e.g. {@code https://*.onrender.com}) if ever needed, while still
     * working with exact origins.
     */
    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    /**
     * Endpoints that do not require a JWT.
     * <ul>
     *   <li>{@code /api/v1/auth/**} - register/login, obviously must be public.</li>
     *   <li>{@code /api/v1/services} - the public service catalogue
     *       (equivalent to the original static {@code services.html}).</li>
     *   <li>{@code /api/v1/contact} - the public contact form, usable by
     *       visitors who are not logged in (matches {@code contact.html}).</li>
     *   <li>{@code /actuator/health} - load balancer / k8s readiness probes
     *       must be reachable without auth.</li>
     *   <li>{@code /swagger-ui/**}, {@code /v3/api-docs/**} - API documentation.</li>
     * </ul>
     */
    private static final String[] PUBLIC_ENDPOINTS = {
            "/api/v1/auth/**",
            "/api/v1/services",
            "/api/v1/services/**",
            "/api/v1/contact",
            // Availability is safe to expose publicly — it returns only
            // booked time slots (no patient data), and students need it
            // before they are logged in to see which slots are free.
            "/api/v1/appointments/availability",
            "/actuator/health",
            "/actuator/health/**",
            "/swagger-ui/**",
            "/v3/api-docs/**"
    };

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF protection is unnecessary for a stateless, token-based
                // API consumed by a separate SPA - there is no browser-managed
                // session cookie for an attacker to ride on.
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // CORS preflight
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration allowing the React frontend (served from a
     * different origin - e.g. a CDN / Vercel / S3+CloudFront URL while the
     * API runs on its own domain) to call this API.
     *
     * <p>Origins are read from configuration ({@code app.cors.allowed-origins}
     * in {@code application.yml}) rather than hard-coded, so the same JAR
     * can be deployed to staging and production with different allowed
     * frontend origins purely via environment variables - no rebuild
     * required.</p>
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> origins = Arrays.stream(allowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        configuration.setAllowedOriginPatterns(origins);

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(false); // no cookies used - tokens are sent via header
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}