# 🎰 PvP CASINO

A PvP casino battle experience using slots games.

## Getting Started

Clone all projects into the same folder, then run ONE of the following commands:

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

### 👉🏼 Docker

#### Run Everything

```bash
docker compose --profile services up --build
```

#### Run Frontend only

```bash
docker compose --profile frontend up --build
```

#### Run Backend only

```bash
docker compose --profile backend up --build
```

### URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
