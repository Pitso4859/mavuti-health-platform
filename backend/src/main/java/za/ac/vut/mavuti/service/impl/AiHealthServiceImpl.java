package za.ac.vut.mavuti.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import za.ac.vut.mavuti.dto.AiDtos.AiChatRequest;
import za.ac.vut.mavuti.dto.AiDtos.AiChatResponse;
import za.ac.vut.mavuti.dto.AiDtos.ConversationTurn;
import za.ac.vut.mavuti.service.AiHealthService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Calls the Google Gemini REST API to power the in-clinic AI health
 * assistant. Stateless: each request includes conversation history
 * supplied by the React client so no server-side session is required.
 *
 * <p><b>Safety guardrails via system prompt:</b>
 * The system instruction constrains Gemini to health topics only and
 * explicitly instructs it to recommend professional consultation for
 * anything it cannot safely answer. This is the MINIMUM responsible
 * setup for health-adjacent AI in a university context.</p>
 *
 * <p><b>Emergency escalation:</b> Any message containing crisis keywords
 * triggers an immediate hard-coded emergency response with clinic numbers
 * rather than calling the AI API. The AI is not an emergency responder.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AiHealthServiceImpl implements AiHealthService {

    private final WebClient.Builder webClientBuilder;

    @Value("${app.gemini.api-key:}")
    private String apiKey;

    @Value("${app.gemini.base-url:https://generativelanguage.googleapis.com/v1beta/models}")
    private String baseUrl;

    @Value("${app.gemini.model:gemini-1.5-flash}")
    private String model;

    @Value("${app.gemini.max-tokens:1024}")
    private int maxTokens;

    @Value("${app.gemini.temperature:0.3}")
    private double temperature;

    // Keywords that bypass the AI and trigger immediate emergency response
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

    private static final String SYSTEM_INSTRUCTION = """
            You are the Mavuti Health Assistant — a helpful, professional, and empathetic AI 
            health assistant for the Vaal University of Technology (VUT) Health Clinic in 
            Vanderbijlpark, South Africa.
            
            YOUR ROLE:
            - Provide general health information and education
            - Help students and staff understand health concepts
            - Guide users on how to book clinic appointments
            - Explain clinic services: General Consultation, Health Screening, Mental Health 
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

    @Override
    public AiChatResponse chat(AiChatRequest request, String userId) {
        // 1. Emergency keyword check — never call AI for crises
        String lower = request.message().toLowerCase();
        boolean isEmergency = EMERGENCY_KEYWORDS.stream().anyMatch(lower::contains);
        if (isEmergency) {
            log.warn("Emergency keywords detected in message from user: {}", userId);
            return AiChatResponse.ok(EMERGENCY_RESPONSE, 0);
        }

        // 2. API key must be configured
        if (apiKey == null || apiKey.isBlank()) {
            log.error("Gemini API key is not configured");
            return AiChatResponse.error(
                    "AI assistant is temporarily unavailable. For clinic help, call (016) 950-9000.");
        }

        try {
            // 3. Build Gemini content array (system + history + current message)
            List<Map<String, Object>> contents = buildContents(request);

            // 4. Build request body per Gemini generateContent API spec
            Map<String, Object> requestBody = Map.of(
                    "system_instruction", Map.of(
                            "parts", List.of(Map.of("text", SYSTEM_INSTRUCTION))
                    ),
                    "contents", contents,
                    "generationConfig", Map.of(
                            "maxOutputTokens", maxTokens,
                            "temperature", temperature,
                            "topP", 0.8,
                            "topK", 40
                    ),
                    "safetySettings", buildSafetySettings()
            );

            // 5. Call Gemini REST endpoint
            String url = String.format("%s/%s:generateContent?key=%s", baseUrl, model, apiKey);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = webClientBuilder.build()
                    .post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            return parseGeminiResponse(response);

        } catch (WebClientResponseException e) {
            log.error("Gemini API HTTP error {}: {}", e.getStatusCode(), e.getResponseBodyAsString());
            return AiChatResponse.error(
                    "I'm having trouble connecting right now. Please try again shortly.");
        } catch (Exception e) {
            log.error("Unexpected error calling Gemini API for user {}: {}", userId, e.getMessage());
            return AiChatResponse.error(
                    "Something went wrong. For immediate help, call the clinic at (016) 950-9000.");
        }
    }

    /**
     * Converts our conversation history + current message to Gemini's
     * "contents" format: [{role, parts:[{text}]}, ...].
     */
    private List<Map<String, Object>> buildContents(AiChatRequest request) {
        List<Map<String, Object>> contents = new ArrayList<>();

        // Add conversation history (max 10 turns for token efficiency)
        if (request.history() != null) {
            List<ConversationTurn> limitedHistory = request.history().stream()
                    .skip(Math.max(0, request.history().size() - 10))
                    .toList();

            for (ConversationTurn turn : limitedHistory) {
                String geminiRole = "assistant".equals(turn.role()) ? "model" : "user";
                contents.add(Map.of(
                        "role", geminiRole,
                        "parts", List.of(Map.of("text", turn.content()))
                ));
            }
        }

        // Current user message
        contents.add(Map.of(
                "role", "user",
                "parts", List.of(Map.of("text", request.message()))
        ));

        return contents;
    }

    /**
     * Configures Gemini's built-in safety filters.
     * BLOCK_MEDIUM_AND_ABOVE for dangerous categories given health context.
     */
    private List<Map<String, Object>> buildSafetySettings() {
        return List.of(
                Map.of("category", "HARM_CATEGORY_HARASSMENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_HATE_SPEECH", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold", "BLOCK_MEDIUM_AND_ABOVE"),
                Map.of("category", "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold", "BLOCK_MEDIUM_AND_ABOVE")
        );
    }

    @SuppressWarnings("unchecked")
    private AiChatResponse parseGeminiResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates =
                    (List<Map<String, Object>>) response.get("candidates");

            if (candidates == null || candidates.isEmpty()) {
                // Check for prompt feedback (e.g. safety block)
                Map<String, Object> promptFeedback =
                        (Map<String, Object>) response.get("promptFeedback");
                if (promptFeedback != null) {
                    String blockReason = (String) promptFeedback.get("blockReason");
                    if (blockReason != null) {
                        return AiChatResponse.ok(
                                "I can't answer that question. For health concerns, please " +
                                "visit the clinic directly or call (016) 950-9000.", 0);
                    }
                }
                return AiChatResponse.error("No response received from AI. Please try again.");
            }

            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");

            // Extract token usage if available
            int totalTokens = 0;
            Map<String, Object> usageMetadata = (Map<String, Object>) response.get("usageMetadata");
            if (usageMetadata != null) {
                Object total = usageMetadata.get("totalTokenCount");
                if (total instanceof Number n) totalTokens = n.intValue();
            }

            return AiChatResponse.ok(text.trim(), totalTokens);

        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", e.getMessage());
            return AiChatResponse.error("Failed to parse AI response. Please try again.");
        }
    }
}
