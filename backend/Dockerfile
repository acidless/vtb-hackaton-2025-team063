ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS deps

WORKDIR /app
ENV NODE_ENV=development

COPY package.json package-lock.json ./
RUN npm ci


FROM node:${NODE_VERSION} AS builder

WORKDIR /app
ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build


FROM node:${NODE_VERSION} AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -g 1001 nest && adduser -D -u 1001 -G nest nestjs

RUN mkdir -p /app/uploads \
    && chown -R nestjs:nest /app/uploads \
    && chmod 755 /app/uploads

COPY --from=builder --chown=nestjs:nest /app/dist ./dist
COPY --from=deps --chown=nestjs:nest /app/node_modules ./node_modules
COPY --chown=nestjs:nest package.json package-lock.json ./

USER nestjs

EXPOSE 8000

ENV PORT=8000
CMD ["node", "dist/main.js"]
