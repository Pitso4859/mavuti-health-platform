# ── Stage 1: Build React app ───────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Cache node_modules layer
COPY package.json ./
RUN npm install --frozen-lockfile

# Copy source and build
COPY . .

# Inject production API URL at build time
ARG VITE_API_BASE_URL=https://mavuti-api.onrender.com
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

RUN npm run build

# ── Stage 2: Serve with Nginx ──────────────────────────────
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Custom nginx config supporting React Router (catch-all → index.html)
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Nginx runs as non-root in 1.27-alpine by default
CMD ["nginx", "-g", "daemon off;"]
