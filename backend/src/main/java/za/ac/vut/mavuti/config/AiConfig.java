package za.ac.vut.mavuti.config;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Exposes the Spring AI {@link ChatClient} bean.
 *
 * <p>Spring AI auto-configures the underlying {@link ChatModel}
 * (VertexAiGeminiChatModel) from {@code spring.ai.vertex.ai.gemini.*}
 * properties. We wrap it in a {@link ChatClient} here so services receive
 * a single, fluent entry-point rather than the lower-level model directly.</p>
 *
 * <p>To switch providers (e.g. Claude, OpenAI), replace the starter
 * dependency in pom.xml and update the properties — this bean and
 * {@link za.ac.vut.mavuti.service.impl.AiHealthServiceImpl} need no changes.</p>
 */
@Configuration
public class AiConfig {

    @Bean
    public ChatClient chatClient(ChatModel chatModel) {
        return ChatClient.builder(chatModel).build();
    }
}
