package za.ac.vut.mavuti.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * Validates the {@code Authorization: Bearer <token>} header on every
 * request and, if valid, populates the Spring Security context with the
 * caller's identity and role.
 *
 * <p>Runs once per request ({@link OncePerRequestFilter}) before the
 * request reaches any {@code @RestController}. If no token is present, or
 * the token is invalid/expired, the filter simply does nothing and lets
 * the request continue unauthenticated - Spring Security's
 * {@code authorizeHttpRequests} rules (configured in
 * {@link SecurityConfig}) then decide whether an anonymous request is
 * allowed to reach the target endpoint (e.g. {@code GET /api/v1/services}
 * is public, {@code POST /api/v1/appointments} is not).</p>
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader(AUTH_HEADER);

        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        final String token = authHeader.substring(BEARER_PREFIX.length());

        if (jwtService.isTokenValid(token)) {
            String institutionNumber = jwtService.extractInstitutionNumber(token);
            String role = jwtService.extractRole(token);
            Long userId = jwtService.extractUserId(token);

            // Role claims are prefixed "ROLE_" so they can be referenced
            // directly in @PreAuthorize("hasRole('EMPLOYEE')") expressions,
            // following Spring Security's expected convention.
            var authority = new SimpleGrantedAuthority("ROLE_" + role);

            var authToken = new UsernamePasswordAuthenticationToken(
                    new AuthenticatedUser(userId, institutionNumber, role),
                    null,
                    List.of(authority)
            );
            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

            SecurityContextHolder.getContext().setAuthentication(authToken);
        }

        filterChain.doFilter(request, response);
    }
}
