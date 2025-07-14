// Main entry point for the socket server
// This file is used to handle socket connections and events
import lobbySockets from "./lobby.js";
import matchSockets from "./match.js";

export default function manejarSockets(io) {
  io.on("connection", (socket) => {
    console.log("🎮 Player connected:", socket.id);

    // Ejecute lobby sockets
    lobbySockets(socket, io);

    // Ejecute match sockets
    matchSockets(socket, io);

    socket.on("disconnect", () => {
      console.log("🚪 Player disconnected:", socket.id);
    });
  });
}
