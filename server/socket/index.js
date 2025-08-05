import lobbySockets from "./lobby/lobbySockets.js";
import matchSockets from "./match/matchSockets.js";

export default function manejarSockets(io) {
  io.on("connection", (socket) => {
    console.log(`🟢 Player connected. Socket ID: ${socket.id}`);

    // Lobby socket handlers
    lobbySockets(socket, io);

    // Ejecute match sockets
    matchSockets(socket, io);

    // Disconnect event
    socket.on("disconnect", (reason) => {
      console.log(`🔌 Player disconnected (${reason})`);
    });
  });
}
