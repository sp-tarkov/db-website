FROM node:20.12-slim AS base

# Update and install dependencies
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Install Latest Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Frontend build stage
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend .
RUN npm install
RUN npm run build:prod

# Copy built frontend into backend public directory
FROM base AS backend-build
WORKDIR /app/api
RUN mkdir -p /app/api/public
COPY --from=frontend-build /app/frontend/dist/* /app/api/public/

# Backend build stage
COPY api .
RUN cp .env.example .env
RUN bun install

# Final image
FROM base
WORKDIR /app/api
COPY --from=backend-build /app/api .
EXPOSE 3001
CMD ["bun", "run", "start"]
