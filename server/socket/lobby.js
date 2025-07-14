// Lobby sockets events
export default function lobbySockets(socket) {
    // Send id to the frondend when a player connects
    socket.emit("welcome", socket.id);
  }
  