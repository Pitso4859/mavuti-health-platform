package za.ac.vut.mavuti.security;

/**
 * The "principal" object placed in the Spring Security context after a
 * JWT is validated. Deliberately a small immutable record rather than
 * loading the full {@link za.ac.vut.mavuti.entity.User} entity on every
 * request - the token already carries everything controllers need
 * (id, institution number, role), so no database hit is required just to
 * authenticate a request. If a controller needs the full user profile
 * (e.g. {@code GET /api/v1/users/me}), it fetches it explicitly by
 * {@code userId} via {@code UserRepository} in that one endpoint only.
 */
public record AuthenticatedUser(Long userId, String institutionNumber, String role) {
}
