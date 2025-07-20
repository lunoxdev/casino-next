FROM node:lts-alpine AS development

RUN corepack enable && corepack prepare pnpm@8.6.5 --activate

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY server/package.json server/pnpm-lock.yaml ./server/

RUN pnpm install

COPY server ./server/

WORKDIR /app/server

EXPOSE 3001

CMD ["node", "server.js"]
