ARG NODE_VERSION=20-alpine

FROM node:${NODE_VERSION} AS deps

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

FROM node:${NODE_VERSION} AS builder

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ARG API_BASE_URL_INTERNAL
ARG NEXT_PUBLIC_UPLOADS_BASE_URL
ARG NEXT_PUBLIC_VAPID_PUBLIC_KEY

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV API_BASE_URL_INTERNAL=${API_BASE_URL_INTERNAL}
ENV NEXT_PUBLIC_VAPID_PUBLIC_KEY=${NEXT_PUBLIC_VAPID_PUBLIC_KEY}

RUN npm run build

FROM node:${NODE_VERSION} AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOST=0.0.0.0
ENV PORT=3000

RUN addgroup -g 1001 next && adduser -D -u 1001 -G next nextjs

COPY --from=builder --chown=nextjs:next /app/.next ./.next
COPY --from=builder --chown=nextjs:next /app/public ./public
COPY --from=deps --chown=nextjs:next /app/node_modules ./node_modules
COPY --chown=nextjs:next package.json package-lock.json ./

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "start"]