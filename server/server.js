import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import manageSockets from "./socket/index.js";
import authRoutes from "./routes/playerAuth.js";
import profileRoutes from "./routes/profile.js";

// App and server initialization
const app = express();
const server = http.createServer(app);

// CORS configuration
const allowedOrigins = [
  "https://pvpcasino.vercel.app",
  "https://pvp-casino.fly.dev",
  "http://localhost:5173",
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middlewares
app.use(express.json());

// Routes
app.use("/api/playerAuth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Backend ready!</h1>");
});

// Sockets
manageSockets(io);

// Start server
server.listen(3001, () =>
  console.log("✅ Backend ready on http://localhost:3001")
);
