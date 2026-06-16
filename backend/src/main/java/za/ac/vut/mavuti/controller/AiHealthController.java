package za.ac.vut.mavuti.controller;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import za.ac.vut.mavuti.dto.AiDtos.AiChatRequest;
import za.ac.vut.mavuti.dto.AiDtos.AiChatResponse;
import za.ac.vut.mavuti.security.AuthenticatedUser;
import za.ac.vut.mavuti.service.AiHealthService;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * AI Health Assistant endpoint — authenticated users only.
 *
 * <p>Per-user rate limiting via Bucket4j prevents abuse of the Gemini API
 * quota. Each user gets 10 requests/minute. The bucket map is in-memory
 * (acceptable for a single-instance deployment; use Redis-backed Bucket4j
 * if horizontal scaling is needed).</p>
 *
 * <p>The endpoint requires authentication so messages can be scoped to a
 * known user (for audit/safety logs) and so anonymous scraping of the
 * Gemini quota is impossible.</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/v1/ai")
@RequiredArgsConstructor
public class AiHealthController {

    private final AiHealthService aiHealthService;

    /**
     * Per-user rate-limit buckets: 10 requests per 60 seconds.
     * ConcurrentHashMap is thread-safe for the computeIfAbsent pattern.
     */
    private final Map<String, Bucket> userBuckets = new ConcurrentHashMap<>();

    @PostMapping("/chat")
    public ResponseEntity<AiChatResponse> chat(
            @Valid @RequestBody AiChatRequest request,
            Authentication authentication
    ) {
        String userId = String.valueOf(currentUserId(authentication));

        // Check rate limit
        Bucket bucket = userBuckets.computeIfAbsent(userId, this::newBucket);
        if (!bucket.tryConsume(1)) {
            log.warn("Rate limit exceeded for user: {}", userId);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(AiChatResponse.error(
                            "Too many requests. Please wait a moment before asking again."));
        }

        log.debug("AI chat request from user: {}, message length: {}",
                userId, request.message().length());

        AiChatResponse response = aiHealthService.chat(request, userId);
        return ResponseEntity.ok(response);
    }

    private Bucket newBucket(String userId) {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    private Long currentUserId(Authentication authentication) {
        return ((AuthenticatedUser) authentication.getPrincipal()).userId();
    }
}
