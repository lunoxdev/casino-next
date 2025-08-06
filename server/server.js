import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import manageSockets from "./socket/index.js";
import authRoutes from "./routes/playersAuth_test.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/playerAuth", authRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Backend ready!</h1>");
});

// Sockets
manageSockets(io);

// Start server
server.listen(3001, () =>
  console.log("✅ Backend ready on http://localhost:3001")
);
