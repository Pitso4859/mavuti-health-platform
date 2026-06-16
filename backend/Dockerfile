# ── Stage 1: Build ──────────────────────────────────────────────────────────
# Uses Microsoft's OpenJDK which has excellent native ARM64 support
# and is the most reliable choice for ARM Windows / Apple Silicon.
FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu AS builder

WORKDIR /build

# Install Maven (not bundled in this image)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends maven && \
    rm -rf /var/lib/apt/lists/*

# Cache dependencies layer
COPY pom.xml ./
RUN mvn dependency:go-offline -q || true

# Build the JAR
COPY src ./src
RUN mvn -B clean package -DskipTests

# ── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM mcr.microsoft.com/openjdk/jdk:21-ubuntu AS runtime

WORKDIR /app

COPY --from=builder /build/target/*.jar app.jar

EXPOSE 8080

ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
