package za.ac.vut.mavuti.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import za.ac.vut.mavuti.dto.AiDtos.AiChatRequest;
import za.ac.vut.mavuti.dto.AiDtos.AiChatResponse;
import za.ac.vut.mavuti.dto.AiDtos.ConversationTurn;
import za.ac.vut.mavuti.service.AiHealthService;

import java.util.ArrayList;
import java.util.List;

/**
 * Spring AI-powered implementation of the Mavuti health assistant.
 *
 * <p>Replaces the raw WebClient/Gemini REST approach with the Spring AI
 * {@link ChatClient} abstraction. Benefits:</p>
 * <ul>
 *   <li>Model-agnostic: swap Gemini for Claude/OpenAI by changing a dependency + config</li>
 *   <li>Built-in prompt fluent API — no manual JSON map construction</li>
 *   <li>Structured response via {@link ChatResponse} — token metadata included</li>
 *   <li>Testable via {@link org.springframework.ai.chat.model.ChatModel} mock</li>
 * </ul>
 *
 * <p><b>Safety guardrails:</b> A {@link SystemMessage} constrains the model to
 * health topics only and directs crises to VUT clinic numbers. Emergency keywords
 * still short-circuit to a hard-coded response before any API call.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiHealthServiceImpl implements AiHealthService {

    /** Spring AI auto-configures this bean from spring.ai.vertex.ai.gemini.* properties. */
    private final ChatClient chatClient;

    // -----------------------------------------------------------------------
    // Emergency guardrail — bypasses AI for crisis keywords
    // -----------------------------------------------------------------------

    private static final List<String> EMERGENCY_KEYWORDS = List.of(
            "suicide", "kill myself", "self harm", "overdose", "emergency",
            "unconscious", "dying", "heart attack", "chest pain", "can't breathe"
    );

    private static final String EMERGENCY_RESPONSE = """
            ⚠️ **This sounds like a medical emergency.**
            
            Please seek immediate help:
            
            🆘 **VUT Emergency Line: (016) 950-9111** (24/7)
            🏥 **Vanderbijlpark Medi-Clinic: (016) 931-5000**
            📞 **National Emergency: 112**
            🧠 **South African Depression Helpline: 0800 567 567**
            
            Please call one of these numbers right now. You are not alone.
            """;

    // -----------------------------------------------------------------------
    // System prompt
    // -----------------------------------------------------------------------

    private static final String SYSTEM_PROMPT = """
            You are the Mavuti Health Assistant — a helpful, professional, and empathetic AI \
            health assistant for the Vaal University of Technology (VUT) Health Clinic in \
            Vanderbijlpark, South Africa.
            
            YOUR ROLE:
            - Provide general health information and education
            - Help students and staff understand health concepts
            - Guide users on how to book clinic appointments
            - Explain clinic services: General Consultation, Health Screening, Mental Health \
              Counseling, Lab Tests, Immunization, and Pharmacy
            - Offer wellness tips relevant to student life (stress, sleep, nutrition, exercise)
            - Provide information about VUT clinic hours: Mon-Fri 8:00-17:00, Sat 9:00-12:00
            
            STRICT LIMITS — you MUST:
            - NEVER diagnose medical conditions
            - NEVER prescribe or recommend specific medications
            - ALWAYS recommend professional medical consultation for specific symptoms
            - ALWAYS direct emergencies to (016) 950-9111 or 112
            - ONLY discuss health-related topics; politely decline off-topic requests
            
            COMMUNICATION STYLE:
            - Warm, professional, and non-judgmental
            - Use simple, clear language (many users are students)
            - Be culturally sensitive (South African university context)
            - Respond in the same language the user writes in (English, Sesotho, Sepedi)
            
            CLINIC CONTACT: (016) 950-9000 | Emergency: (016) 950-9111
            """;

    // -----------------------------------------------------------------------
    // Core chat method
    // -----------------------------------------------------------------------

    @Override
    public AiChatResponse chat(AiChatRequest request, String userId) {
        // 1. Emergency keyword check — never call AI for crises
        if (isEmergency(request.message())) {
            log.warn("Emergency keywords detected from user: {}", userId);
            return AiChatResponse.ok(EMERGENCY_RESPONSE, 0);
        }

        try {
            // 2. Build the message list: system + history + current user message
            List<Message> messages = buildMessages(request);

            // 3. Call Gemini via Spring AI ChatClient
            //    ChatClient.prompt(Prompt) handles serialisation + deserialisation
            ChatResponse response = chatClient
                    .prompt(new Prompt(messages))
                    .call()
                    .chatResponse();

            // 4. Extract reply text
            String reply = response.getResult().getOutput().getText();

            // 5. Extract token usage (Spring AI surfaces this uniformly)
            int tokensUsed = 0;
            if (response.getMetadata() != null && response.getMetadata().getUsage() != null) {
                Integer total = response.getMetadata().getUsage().getTotalTokens();
                if (total != null) tokensUsed = total.intValue();
            }

            log.debug("AI response for user {}: {} tokens used", userId, tokensUsed);
            return AiChatResponse.ok(reply.trim(), tokensUsed);

        } catch (Exception e) {
            log.error("Spring AI call failed for user {}: {}", userId, e.getMessage(), e);
            return AiChatResponse.error(
                    "I'm having trouble connecting right now. " +
                    "For clinic help, please call (016) 950-9000.");
        }
    }

    // -----------------------------------------------------------------------
    // Helpers
    // -----------------------------------------------------------------------

    private boolean isEmergency(String message) {
        String lower = message.toLowerCase();
        return EMERGENCY_KEYWORDS.stream().anyMatch(lower::contains);
    }

    /**
     * Converts system prompt + conversation history + current message into the
     * Spring AI {@link Message} list that Prompt accepts.
     *
     * <p>History is capped at the last 10 turns to keep token usage bounded.</p>
     */
    private List<Message> buildMessages(AiChatRequest request) {
        List<Message> messages = new ArrayList<>();

        // System instruction first
        messages.add(new SystemMessage(SYSTEM_PROMPT));

        // Conversation history (max 10 turns, oldest-first)
        if (request.history() != null && !request.history().isEmpty()) {
            List<ConversationTurn> limited = request.history().stream()
                    .skip(Math.max(0, request.history().size() - 10))
                    .toList();

            for (ConversationTurn turn : limited) {
                if ("assistant".equals(turn.role())) {
                    messages.add(new AssistantMessage(turn.content()));
                } else {
                    messages.add(new UserMessage(turn.content()));
                }
            }
        }

        // Current user message
        messages.add(new UserMessage(request.message()));

        return messages;
    }
}
