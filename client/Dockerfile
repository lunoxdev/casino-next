FROM node:lts-alpine AS development

RUN corepack enable && corepack prepare pnpm@8.6.5 --activate

WORKDIR /app

COPY pnpm-workspace.yaml ./
COPY client/package.json client/pnpm-lock.yaml ./client/

RUN pnpm install

COPY client ./client/

WORKDIR /app/client

EXPOSE 5173

CMD ["pnpm", "dev"]