# Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Vite/Astro build-time public env (inlined into the client bundle)
ARG VITE_API_BASE_URL
ARG VITE_SECRET_KEY
ARG VITE_USE_MOCK
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SECRET_KEY=$VITE_SECRET_KEY \
    VITE_USE_MOCK=$VITE_USE_MOCK \
    VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build application (hybrid + @astrojs/node → dist/client + dist/server)
RUN npm run build \
    && npm prune --omit=dev

# Production: run Astro Node standalone server (not static `serve dist`)
FROM node:24-alpine

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Standalone server still resolves runtime packages (e.g. react) from node_modules
COPY --chown=nextjs:nodejs --from=builder /app/package.json ./package.json
COPY --chown=nextjs:nodejs --from=builder /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs --from=builder /app/dist ./dist

USER nextjs

ENV HOST=0.0.0.0
ENV PORT=3000

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://127.0.0.1:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Astro standalone adapter entrypoint
CMD ["node", "./dist/server/entry.mjs"]
