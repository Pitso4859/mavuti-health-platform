package za.ac.vut.mavuti.config;

import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

/**
 * Configures the shared {@link WebClient.Builder} bean used by
 * {@link za.ac.vut.mavuti.service.impl.AiHealthServiceImpl} to call
 * the Gemini REST API.
 *
 * <p>Timeout values are deliberately conservative for a health assistant
 * context:</p>
 * <ul>
 *   <li><b>Connect timeout (3 s):</b> If Gemini is unreachable we fail fast
 *       rather than holding the user's thread for the OS default (often 30 s
 *       or more). The AI chat widget shows an error immediately so the user
 *       can fall back to calling the clinic.</li>
 *   <li><b>Read timeout (20 s):</b> Gemini's 1.5-Flash model typically
 *       responds in 1–5 s for the short health queries expected here. 20 s
 *       gives enough headroom for slow responses under load while still
 *       bounding the wait.</li>
 * </ul>
 *
 * <p>The {@link ExchangeStrategies} buffer is set to 2 MB — well above
 * the largest Gemini response this use case produces but small enough to
 * prevent a misconfigured model from streaming hundreds of megabytes into
 * heap.</p>
 */
@Configuration
public class WebClientConfig {

    private static final int CONNECT_TIMEOUT_MS = 3_000;
    private static final int READ_TIMEOUT_SEC   = 20;
    private static final int WRITE_TIMEOUT_SEC  = 10;
    private static final int MAX_RESPONSE_MB    = 2;

    @Bean
    public WebClient.Builder webClientBuilder() {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, CONNECT_TIMEOUT_MS)
                .responseTimeout(Duration.ofSeconds(READ_TIMEOUT_SEC))
                .doOnConnected(conn -> conn
                        .addHandlerLast(new ReadTimeoutHandler(READ_TIMEOUT_SEC,  TimeUnit.SECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(WRITE_TIMEOUT_SEC, TimeUnit.SECONDS))
                );

        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(config -> config
                        .defaultCodecs()
                        .maxInMemorySize(MAX_RESPONSE_MB * 1024 * 1024))
                .build();

        return WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .exchangeStrategies(strategies);
    }
}
