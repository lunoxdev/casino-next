import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import manageSockets from "./socket/index.js";
import playerRoutes from "./routes/player.js";
import pool from "./db.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/player", playerRoutes);

pool
  .query("SELECT NOW()")
  .then((res) => console.log("✅ DB connected at:", res.rows[0].now))
  .catch((err) => console.error("❌ DB connection error:", err));

manageSockets(io);

server.listen(3001, () =>
  console.log("✅ Backend ready on http://localhost:3001")
);

app.get("/", (req, res) => {
  res.send(
    "<h1>Backend is running and ready to accept socket connections!</h1>"
  );
});
