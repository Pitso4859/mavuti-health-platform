package za.ac.vut.mavuti.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;
import za.ac.vut.mavuti.dto.AiDtos.AiChatRequest;
import za.ac.vut.mavuti.dto.AiDtos.AiChatResponse;
import za.ac.vut.mavuti.dto.AiDtos.ConversationTurn;
import za.ac.vut.mavuti.service.AiHealthService;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class AiHealthServiceImpl implements AiHealthService {

    // Inject ChatClient.Builder (provided by AiConfig)
    private final ChatClient chatClient;

    public AiHealthServiceImpl(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    // ── System Prompt ──────────────────────────────────────────────────────────

    private static final String SYSTEM_PROMPT = """
            You are the Mavuti Health Assistant — a helpful, professional, and empathetic AI
            health assistant for the Vaal University of Technology (VUT) Health Clinic in
            Vanderbijlpark, South Africa.

            YOUR ROLE:
            - Provide accurate general health information and wellness education
            - Help VUT students and staff understand health concepts
            - Guide users on booking clinic appointments (online at mavuti-health.onrender.com)
            - Explain clinic services: General Consultation, Health Screening, Mental Health
              Counselling, Family Planning, Chronic Disease Management, Emergency Care
            - Offer wellness tips for student life: stress management, sleep, nutrition, exercise
            - Provide first-aid guidance for minor issues

            VUT CLINIC INFORMATION:
            - Hours: Monday to Friday, 8:00 AM to 4:30 PM (closed weekends and public holidays)
            - Urgent care (during hours): (016) 950-9000
            - Emergency line: (016) 950-9111
            - After-hours emergency: (016) 950-9595
            - Location: VUT Main Campus, Vanderbijlpark, Gauteng

            BOOKING AN APPOINTMENT:
            1. Go to the Appointment page and click Book
            2. Select your service, choose a date, pick a time slot
            3. Click Confirm Booking
            - Book at least 24 hours in advance
            - Arrive 10 minutes early with your student/staff ID and medical aid card
            - Cancel at least 6 hours before to avoid fees

            STRICT RULES you MUST follow at all times:
            - NEVER diagnose medical conditions
            - NEVER recommend specific prescription medications or dosages
            - ALWAYS recommend professional consultation for specific or serious symptoms
            - ALWAYS direct emergencies to (016) 950-9111 or 112 immediately
            - ONLY discuss health, wellness, and clinic-related topics
            - Politely decline off-topic requests and redirect to health topics

            COMMUNICATION STYLE:
            - Warm, professional, and non-judgmental
            - Use simple, clear language appropriate for university students
            - Be culturally sensitive to the South African context
            - Respond in the same language the user writes in (English, Sesotho, Sepedi, Zulu)
            - Keep responses concise and structured, use bullet points where helpful
            - Format key information in bold for scannability
            """;

    // ── Emergency Detection ────────────────────────────────────────────────────

    private static final List<String> EMERGENCY_KEYWORDS = List.of(
            "suicide", "kill myself", "want to die", "self harm", "self-harm",
            "overdose", "unconscious", "dying", "heart attack", "chest pain",
            "can't breathe", "cannot breathe", "stroke", "seizure", "bleeding heavily"
    );

    private static final String EMERGENCY_RESPONSE = """
            \u26a0\ufe0f **This sounds like a medical emergency.**

            Please seek immediate help right now:

            \ud83c\udd98 **VUT Emergency Line: (016) 950-9111** (available 24/7)
            \ud83c\udfe5 **Vanderbijlpark Medi-Clinic: (016) 931-5000**
            \ud83d\udcde **National Emergency Services: 112**
            \ud83e\udde0 **SA Depression & Anxiety Helpline: 0800 567 567** (free, 24/7)
            \ud83d\udc99 **SADAG Crisis Line: 0800 21 22 23** (free, 24/7)

            Please call one of these numbers right now. You are not alone.
            """;

    // ── Main chat method ───────────────────────────────────────────────────────

    @Override
    public AiChatResponse chat(AiChatRequest request, String userId) {

        // 1. Emergency keyword check — never route crisis messages to the AI
        String lower = request.message().toLowerCase();
        boolean isEmergency = EMERGENCY_KEYWORDS.stream().anyMatch(lower::contains);
        if (isEmergency) {
            log.warn("Emergency keywords detected from user: {}", userId);
            return AiChatResponse.ok(EMERGENCY_RESPONSE, 0);
        }

        try {
            // 2. Build message list: system prompt + history + current user message
            List<Message> messages = buildMessages(request);

            // 3. Call the AI model via Spring AI
            // .call().content() is the correct Spring AI 1.0.x fluent API
            String reply = chatClient
                    .prompt(new Prompt(messages))
                    .call()
                    .content();

            if (reply == null || reply.isBlank()) {
                return AiChatResponse.error("No response received. Please try again.");
            }

            log.debug("AI response generated for user: {}", userId);
            return AiChatResponse.ok(reply.trim(), 0);

        } catch (Exception e) {
            log.error("AI error for user {}: {}", userId, e.getMessage());

            String errorMsg = (e.getMessage() != null && e.getMessage().contains("api_key"))
                    ? "AI assistant is not configured. For help, call (016) 950-9000."
                    : "I'm having trouble right now. Please try again, or call (016) 950-9000.";

            return AiChatResponse.error(errorMsg);
        }
    }

    // ── Build Spring AI message list ──────────────────────────────────────────

    private List<Message> buildMessages(AiChatRequest request) {
        List<Message> messages = new ArrayList<>();

        // System prompt sets the assistant's persona and rules
        messages.add(new SystemMessage(SYSTEM_PROMPT));

        // Conversation history gives context for follow-up questions (max 10 turns)
        if (request.history() != null && !request.history().isEmpty()) {
            List<ConversationTurn> limited = request.history().stream()
                    .skip(Math.max(0, request.history().size() - 10))
                    .toList();

            for (ConversationTurn turn : limited) {
                if ("user".equals(turn.role())) {
                    messages.add(new UserMessage(turn.content()));
                } else {
                    messages.add(new AssistantMessage(turn.content()));
                }
            }
        }

        // Current user message
        messages.add(new UserMessage(request.message()));

        return messages;
    }
}