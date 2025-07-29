FROM node:lts-alpine 
WORKDIR /app
COPY . .
RUN npm install -g pnpm && pnpm install
EXPOSE 3001
CMD ["node", "server.js"]
