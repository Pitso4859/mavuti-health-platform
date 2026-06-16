package za.ac.vut.mavuti.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configures the Swagger UI / OpenAPI spec served at {@code /swagger-ui/index.html}.
 *
 * <p>Including this from day one means the React frontend, and any future
 * consumer (mobile app, integration partner), has a single source of truth
 * for the API contract that is generated from the code itself - it cannot
 * drift out of sync with the actual endpoints the way a hand-maintained
 * Postman collection can.</p>
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI mavutiOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                .info(new Info()
                        .title("Mavuti Health Clinic Platform API")
                        .description("Backend API for the VUT Mavuti Health Clinic appointment booking system. " +
                                "Serves both students (login via student number) and employees " +
                                "(login via employee number).")
                        .version("v1.0.0")
                        .contact(new Contact().name("Pitso Nkotolane").url("https://pitsoporfolio.co.za")))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components().addSecuritySchemes(securitySchemeName,
                        new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
