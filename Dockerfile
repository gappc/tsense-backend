ARG ALPINE_VERSION=3.21

FROM node:23-alpine${ALPINE_VERSION} AS builder

ENV LANGUAGE='en_US:en'

RUN mkdir -p /app && chown -R node:node /app
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Production image
FROM alpine:${ALPINE_VERSION} as build

WORKDIR /app

RUN apk add --no-cache libstdc++ dumb-init \
  && addgroup -g 1000 node && adduser -u 1000 -G node -s /bin/sh -D node \
  && chown node:node ./
COPY --from=builder /usr/local/bin/node /usr/local/bin/

USER node

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["dumb-init", "node", "dist/server.js"]