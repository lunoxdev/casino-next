// Main entry point for the socket server
// This file is used to handle socket connections and events
import matchSockets from "./match.js";

export default function manejarSockets(io) {
  io.on("connection", (socket) => {
    console.log("🎮 Player connected:", socket.id);

    // Ejecute match sockets
    matchSockets(socket, io);

    socket.on("disconnect", () => {
      console.log("🚪 Player disconnected:", socket.id);
    });
  });
}
