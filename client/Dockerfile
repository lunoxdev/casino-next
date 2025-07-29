FROM node:lts-alpine 
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install
EXPOSE 5173
CMD ["pnpm", "dev"]