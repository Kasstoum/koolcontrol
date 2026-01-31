# Stage 1: build Expo web
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx expo export --platform web

# Stage 2: serve with Caddy
FROM caddy:alpine

COPY --from=builder /app/dist /srv
COPY docker/Caddyfile /etc/caddy/Caddyfile

EXPOSE 80

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
