FROM node:20.12-slim

# Set the PROD environment variable from the build argument
ARG PROD
ENV PROD=$PROD

# Update and install dependencies
RUN apt-get update && apt-get install -y curl unzip && rm -rf /var/lib/apt/lists/*

# Install Latest Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV BUN_INSTALL="/root/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"

# Set up working directory
WORKDIR /app

# Copy and build frontend
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install

# Conditionally run production or development build
RUN if [ "$PROD" = "true" ]; then npm run build:prod; else npm run build; fi

# Move built frontend assets into backend public directory
WORKDIR /app
RUN mkdir -p ./api/public
RUN cp -r ./frontend/dist/* ./api/public/

# Copy and build backend
COPY api ./api
WORKDIR /app/api
RUN cp .env.example .env
RUN bun install

# Final setup
WORKDIR /app/api
EXPOSE 3001
CMD ["bun", "run", "start"]
