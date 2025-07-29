# 🎰 PvP CASINO

A PvP casino battle experience using slots games.

## 🧰 Project Structure

```bash
pvp-casino/
┣ 📂client # Frontend (React + Vite + Tailwind + Zustand + Axios + Socket.IO)
┣ 📂server # Backend (Node.js + Express + Socket.IO)
┣ 📜docker-compose.yml
┗ 📜README.md
```

## Getting Started

Clone all projects into the same folder, then run the following commands:

### 👉🏼 Docker

#### Run Everything

```bash
docker compose --profile services up --build
```

### 👉🏼 Using pnpm

#### ▶️ Start the client

```bash
  cd pvp-casino/client
  pnpm install
  pnpm dev
```

#### 🖥️ Start the server

```bash
  cd pvp-casino/server
  node server.js
```

### URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
