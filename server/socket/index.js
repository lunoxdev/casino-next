// Main entry point for the socket server
// This file is used to handle socket connections and events
import lobbySockets from "./lobby.js";
import matchSockets from "./match.js";

export default function manejarSockets(io) {
  io.on("connection", (socket) => {
    console.log(`🟢 Player with socket ID: ${socket.id} connected`);

    // Ejecute lobby sockets
    lobbySockets(socket, io);

    // Ejecute match sockets
    matchSockets(socket, io);
  });
}
