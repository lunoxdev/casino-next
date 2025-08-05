import lobbySockets from "./lobby/lobbySockets.js";
import matchSockets from "./match/matchSockets.js";

export default function manejarSockets(io) {
  io.on("connection", (socket) => {
    console.log(`🟢 Player with socket ID: ${socket.id} connected`);

    // Lobby socket handlers
    lobbySockets(socket, io);

    // Ejecute match sockets
    matchSockets(socket, io);

    // Disconnect event
    socket.on("disconnect", (reason) => {
      switch (reason) {
        case "io server disconnect":
          console.log(
            "🔌 Disconnected by the server (possibly kicked or forced)."
          );
          break;
        case "io client disconnect":
          console.log("👋 Disconnected by the user (logged out or refreshed).");
          break;
        case "ping timeout":
          console.log("⏱️ Connection lost — server did not respond in time.");
          break;
        case "transport close":
          console.log("📡 Connection closed (network lost or switched).");
          break;
        case "transport error":
          console.log(
            "⚠️ Connection error (server crashed or network failure)."
          );
          break;
        default:
          console.log("Disconnected: ", reason);
      }
    });
  });
}
