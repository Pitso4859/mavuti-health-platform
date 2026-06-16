package za.ac.vut.mavuti.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * Request/response DTOs for the AI health assistant endpoint.
 *
 * <p>The assistant is health-focused and explicitly scoped to the VUT
 * clinic context. The system prompt embedded in the service layer prevents
 * misuse by constraining Gemini to health-related topics only.</p>
 */
public class AiDtos {

    public record AiChatRequest(
            @NotBlank(message = "Message is required")
            @Size(max = 2000, message = "Message must not exceed 2000 characters")
            String message,

            /**
             * Optional conversation history so Gemini can provide
             * contextual responses. Max 10 previous turns kept for
             * token efficiency. Client manages history client-side
             * to keep the backend stateless.
             */
            List<ConversationTurn> history
    ) {}

    public record ConversationTurn(
            String role,    // "user" or "assistant"
            String content
    ) {}

    public record AiChatResponse(
            String reply,
            boolean success,
            String error,
            int tokensUsed
    ) {
        public static AiChatResponse ok(String reply, int tokens) {
            return new AiChatResponse(reply, true, null, tokens);
        }

        public static AiChatResponse error(String message) {
            return new AiChatResponse(null, false, message, 0);
        }
    }
}
