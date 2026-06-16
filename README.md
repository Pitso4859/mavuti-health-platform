# Mavuti Health Platform 

> **VUT Health Clinic · Full-Stack · Spring Boot + React + Gemini AI**

[![CI/CD](https://github.com/your-org/mavuti-health-platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/your-org/mavuti-health-platform/actions)

---

## What's New in 

| Feature |  |  |
|---|---|---|
| **AI Health Assistant** | ✗ | ✅ Google Gemini 1.5 Flash |
| **Icons** | FontAwesome (font-based) | ✅ Inline SVG (zero runtime) |
| **CSS Framework** | Bootstrap | ✅ Custom design system (VUT brand) |
| **Auth** | Basic JWT | ✅ JWT + refresh + rate limiting |
| **Rate limiting** | ✗ | ✅ Bucket4j per-user |
| **Docker** | Single-stage | ✅ Multi-stage, non-root |
| **CI/CD** | Stub Jenkinsfile | ✅ GitHub Actions + Jenkins + Render |
| **Env separation** | Single YAML | ✅ dev / prod profiles |
| **Emergency safety** | ✗ | ✅ Keyword bypass, never calls AI |

---

## Project Structure

```
mavuti-health-platform/
├── backend/                        # Spring Boot 3.3 API
│   ├── src/main/java/za/ac/vut/mavuti/
│   │   ├── config/                 # Security, CORS, OpenAPI, DataSeeder
│   │   ├── controller/             # Auth, Appointments, AI, Contact, Services, User
│   │   ├── dto/                    # Request/response records
│   │   ├── entity/                 # User, Appointment, ContactMessage
│   │   ├── enums/                  # UserRole, AppointmentStatus, ServiceType
│   │   ├── exception/              # GlobalExceptionHandler, custom exceptions
│   │   ├── repository/             # Spring Data JPA interfaces
│   │   ├── security/               # JwtUtil, JwtFilter, AuthenticatedUser
│   │   └── service/impl/           # Business logic + AiHealthServiceImpl
│   ├── src/main/resources/
│   │   ├── application.yml         # Base config (Gemini, rate limits, JWT)
│   │   ├── application-dev.yml     # H2 in-memory for local dev
│   │   └── application-prod.yml    # PostgreSQL for Render
│   ├── Dockerfile                  # Multi-stage JDK 21 build
│   └── pom.xml
│
├── frontend/                       # React 19 + Vite + custom CSS
│   ├── src/
│   │   ├── api/                    # client.js (fetch wrapper) + services.js
│   │   ├── components/
│   │   │   ├── Icons.jsx           # All SVG icons (replaces FontAwesome)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── AiChat.jsx          # Gemini-powered floating chat widget
│   │   │   └── RouteGuards.jsx     # ProtectedRoute, PublicOnlyRoute
│   │   ├── context/AuthContext.jsx # JWT auth state + localStorage
│   │   ├── pages/                  # Home, Login, Register, Services,
│   │   │                           # Appointment, Dashboard, Contact
│   │   └── styles/global.css       # Full VUT design system
│   ├── Dockerfile                  # Multi-stage Node build → Nginx
│   ├── nginx.conf                  # SPA routing + caching headers
│   └── vite.config.js
│
├── .github/workflows/ci-cd.yml     # Primary CI/CD (GitHub Actions)
├── Jenkinsfile                     # On-prem Jenkins pipeline
├── docker-compose.yml              # Local full-stack dev
├── render.yaml                     # Render.com IaC blueprint
└── README.md
```

---

## Prerequisites

| Tool | Version |
|---|---|
| Java (JDK) | 21+ |
| Maven | 3.9+ |
| Node.js | 22+ |
| Docker | 24+ |
| Git | Any |

---

## Quick Start — Local Development

### Option A: Docker Compose (recommended — one command)

```bash
# 1. Clone
git clone https://github.com/your-org/mavuti-health-platform.git
cd mavuti-health-platform

# 2. Add your Gemini API key (get free key at aistudio.google.com)
echo "GEMINI_API_KEY=your_key_here" > .env

# 3. Run everything
docker compose up --build

# Frontend → http://localhost:5173
# Backend  → http://localhost:8080
# Swagger  → http://localhost:8080/swagger-ui/index.html
# H2 DB    → http://localhost:8080/h2-console (dev profile only)
```

### Option B: Manual (separate terminals)

```bash
# Terminal 1 — Backend (uses H2 in-memory, no PostgreSQL needed)
cd backend
mvn spring-boot:run

# Terminal 2 — Frontend
cd frontend
npm install
cp .env.example .env.local    # adjust API URL if needed
npm run dev
```

**Default dev credentials** (seeded by `DataSeeder.java`):

| Role | Institution No. | Password |
|---|---|---|
| Student | `221386653` | `Student@123` |
| Employee | `4557545664` | `Employee@123` |

---

## Environment Variables

### Backend

| Variable | Required | Default | Description |
|---|---|---|---|
| `SPRING_PROFILES_ACTIVE` | No | `dev` | `dev` or `prod` |
| `DATABASE_URL` | Prod only | H2 | PostgreSQL JDBC URL |
| `JWT_SECRET` | Yes (prod) | dev default | Min 32-char secret |
| `JWT_EXPIRATION_MS` | No | `86400000` | 24 hours |
| `GEMINI_API_KEY` | No | — | Google AI Studio key |
| `CORS_ALLOWED_ORIGINS` | No | `localhost:5173` | Frontend origin |
| `PORT` | Render sets | `8080` | HTTP port |

### Frontend

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Spring Boot API base URL |

---

## CI/CD Pipeline

### GitHub Actions (primary — `.github/workflows/ci-cd.yml`)

```
push to main
    │
    ├── Job 1: Backend — mvn verify (with PostgreSQL service container)
    ├── Job 2: Frontend — npm ci + lint + build
    │
    ├── Job 3 (after 1+2): Docker build + push to GHCR
    │
    └── Job 4 (after 3): Trigger Render deploy → health check
```

**Required GitHub Secrets:**

| Secret | How to get |
|---|---|
| `RENDER_API_KEY` | Render dashboard → Account → API Keys |
| `RENDER_BACKEND_SERVICE_ID` | Render service URL: `srv-xxx` |
| `RENDER_FRONTEND_SERVICE_ID` | Render service URL: `srv-xxx` |

### Jenkins (optional — `Jenkinsfile`)

Used for on-premises pipelines (e.g. VUT lab). Mirrors the GitHub Actions flow.
Requires credentials configured in Jenkins credential store:
- `github-container-registry` (username/password)
- `render-api-key` (secret text)

---

## Render.com Deployment

### First-time setup

1. Create a Render account at render.com
2. Connect your GitHub repository
3. Click **"New Blueprint"** and select `render.yaml`
4. Render will create:
   - PostgreSQL database (`mavuti-db`)
   - Backend web service (`mavuti-api`)
   - Frontend web service (`mavuti-health`)
5. In the backend service environment variables, manually add:
   - `GEMINI_API_KEY` → your Google AI Studio key
6. Push to `main` — GitHub Actions will trigger the deploy

### Free tier notes

- Render free tier **spins down after 15 minutes of inactivity** — first request takes ~30s
- Upgrade to the **Starter** plan ($7/month) for always-on instances
- PostgreSQL free tier has a **90-day expiry** — back up your data

---

## API Documentation

Swagger UI is available at:
- **Local**: http://localhost:8080/swagger-ui/index.html
- **Production**: https://mavuti-api.onrender.com/swagger-ui/index.html

### Key Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | ✗ | Register new user |
| `POST` | `/api/v1/auth/login` | ✗ | Login → JWT |
| `GET` | `/api/v1/services` | ✗ | List clinic services |
| `POST` | `/api/v1/appointments` | ✅ | Book appointment |
| `GET` | `/api/v1/appointments/me` | ✅ | My appointments |
| `DELETE` | `/api/v1/appointments/{id}` | ✅ | Cancel appointment |
| `GET` | `/api/v1/appointments/availability` | ✅ | Available time slots |
| `POST` | `/api/v1/ai/chat` | ✅ | AI health assistant |
| `POST` | `/api/v1/contact` | ✗ | Send contact message |
| `GET` | `/actuator/health` | ✗ | Health probe (Render) |

---

## AI Health Assistant — Design Decisions

The Gemini integration follows responsible AI principles for a health context:

1. **Emergency bypass** — Any message containing crisis keywords (suicide, overdose, chest pain, etc.) triggers an immediate hard-coded response with emergency numbers. The AI API is **never called** for these messages.

2. **System prompt guardrails** — Gemini is explicitly instructed to never diagnose, never prescribe, always recommend professional consultation, and only discuss health topics.

3. **Rate limiting** — 10 requests/minute per authenticated user prevents quota abuse.

4. **Authentication required** — Anonymous access to the AI endpoint is not permitted.

5. **Stateless** — No conversation sessions are stored server-side. The React client maintains history (max 10 turns) and sends it with each request.

6. **Safety filters** — Gemini's built-in BLOCK_MEDIUM_AND_ABOVE safety settings are enabled for all harm categories.

---

## SDLC Compliance

| Phase | Implementation |
|---|---|
| **Planning** | `docs/` folder with architecture decisions |
| **Requirements** | Service types and user roles defined as enums |
| **Design** | VUT design system in `global.css`, component separation |
| **Development** | Feature-branch Git workflow |
| **Testing** | JUnit 5 unit tests + Spring Boot integration tests |
| **Deployment** | GitHub Actions → Docker → Render.com |
| **Maintenance** | `/actuator/health` probe, structured logging |

---

## Security Checklist

- [x] Passwords hashed with BCrypt (strength 12)
- [x] JWT signed with HS512, configurable expiry
- [x] CORS restricted to known frontend origin
- [x] Rate limiting on auth and AI endpoints
- [x] HTTPS enforced by Render (TLS termination)
- [x] Docker images run as non-root users
- [x] No secrets committed — all via environment variables
- [x] Spring Security denies all unmatched routes by default
- [x] Input validation on all DTOs (`@Valid`, `@NotBlank`, `@Size`)
- [x] Global exception handler — no stack traces in API responses

---

## License

Academic project — Vaal University of Technology · 2026
