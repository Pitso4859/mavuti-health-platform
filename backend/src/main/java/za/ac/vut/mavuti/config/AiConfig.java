package za.ac.vut.mavuti.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
@Slf4j
public class AiConfig {

    @Value("${spring.ai.openai.api-key:}")
    private String apiKey;

    @Value("${spring.ai.openai.base-url:https://generativelanguage.googleapis.com/v1beta/openai/}")
    private String baseUrl;

    @Value("${spring.ai.openai.chat.options.model:gemini-1.5-flash}")
    private String model;

    @Value("${spring.ai.openai.chat.options.temperature:0.3}")
    private Double temperature;

    @Value("${spring.ai.openai.chat.options.max-tokens:1024}")
    private Integer maxTokens;

    @Bean
    @Primary
    public OpenAiApi openAiApi() {
        String key = (apiKey == null || apiKey.isBlank()) ? "dummy-key" : apiKey;

        if ("dummy-key".equals(key)) {
            log.warn("GEMINI_API_KEY is not set — AI assistant will return an error until configured");
        } else {
            log.info("AI API key configured successfully");
        }

        // Spring AI 1.0.1 — OpenAiApi uses a builder, NOT a 2-arg constructor
        return OpenAiApi.builder()
                .baseUrl(baseUrl)
                .apiKey(key)
                .build();
    }

    @Bean
    @Primary
    public OpenAiChatModel openAiChatModel(OpenAiApi openAiApi) {
        OpenAiChatOptions options = OpenAiChatOptions.builder()
                .model(model)
                .temperature(temperature)
                .maxTokens(maxTokens)
                .build();

        log.info("OpenAiChatModel configured — model: {}", model);

        // Spring AI 1.0.1 — OpenAiChatModel also uses a builder
        return OpenAiChatModel.builder()
                .openAiApi(openAiApi)
                .defaultOptions(options)
                .build();
    }

    @Bean
    @Primary
    public ChatClient.Builder chatClientBuilder(OpenAiChatModel chatModel) {
        log.info("ChatClient.Builder bean created");
        // Expose Builder so AiHealthServiceImpl can inject ChatClient.Builder
        return ChatClient.builder(chatModel);
    }
}