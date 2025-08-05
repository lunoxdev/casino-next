import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import manageSockets from "./socket/index.js";
import authRoutes from "./routes/playerAuth.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use("/api/playerAuth", authRoutes);

manageSockets(io);

server.listen(3001, () =>
  console.log("✅ Backend ready on http://localhost:3001")
);

app.get("/", (req, res) => {
  res.send(
    "<h1>Backend is running and ready to accept socket connections!</h1>"
  );
});
