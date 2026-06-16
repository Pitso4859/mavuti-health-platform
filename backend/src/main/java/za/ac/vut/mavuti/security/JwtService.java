package za.ac.vut.mavuti.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

/**
 * Issues and validates the stateless JWTs used for authentication.
 *
 * <p><b>Why JWT over server-side sessions?</b> A session store (e.g.
 * sticky sessions or a shared session table) becomes a bottleneck and a
 * single point of contention once the API is scaled horizontally to many
 * pods - exactly the scenario this platform targets (50,000+ concurrent
 * users behind a load balancer, see {@code docs/ARCHITECTURE.md}). A JWT
 * carries the user's identity and role as a signed, self-contained token;
 * any backend pod can verify it independently using only the shared
 * signing secret, with zero shared mutable state and zero database lookup
 * on the hot path of "is this request authenticated?".</p>
 *
 * <p>The signing key and expiry are externalised to configuration
 * ({@code application.yml}) so the secret can be injected via an
 * environment variable / secrets manager in production rather than
 * committed to source control.</p>
 */
@Service
public class JwtService {

    private final SecretKey signingKey;
    private final long expirationMillis;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-ms}") long expirationMillis
    ) {
        // HMAC-SHA key derived from the configured secret. The secret must
        // be at least 256 bits (32 bytes) for HS256 - enforced by jjwt at
        // runtime if too short, which fails fast on misconfiguration.
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMillis = expirationMillis;
    }

    /**
     * Generates a signed JWT containing the user's institution number
     * (as the subject) and role (as a custom claim).
     */
    public String generateToken(String institutionNumber, String role, Long userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(institutionNumber)
                .addClaims(Map.of("role", role, "uid", userId))
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractInstitutionNumber(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public Long extractUserId(String token) {
        return extractAllClaims(token).get("uid", Long.class);
    }

    public boolean isTokenValid(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception ex) {
            // Any parsing/signature error (malformed, tampered, expired-with-
            // exception) is treated as "invalid" - never propagated as a 500.
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> resolver) {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
