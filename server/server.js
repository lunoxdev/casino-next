import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import manejarSockets from "./socket/index.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

manejarSockets(io);

server.listen(3001, () => console.log("✅ Backend ready on http://localhost:3001"));
