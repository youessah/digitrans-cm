# ============================================================
# DIGITRANS-CM — Dockerfile de l'API Node.js
# Multi-stage : build léger puis image de production minimale
# ============================================================

# ── Étape 1 : Build ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# ── Étape 2 : Image de production ───────────────────────────
FROM node:20-alpine AS production

# Utilisateur non-root pour la sécurité
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app .

# Propriétaire des fichiers = appuser (jamais root)
RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 3000

# Health check — utilisé par le Load Balancer AWS
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
