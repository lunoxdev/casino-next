// Lobby sockets events
import { players } from "../state/playersStore.js";

export default function lobbySockets(socket, io) {
  socket.on("registerPlayer", (name) => {
    players.set(socket.id, { name, balance: 1000 });
    console.log(`📝 Player "${name}" registered with ID ${socket.id}`);

    // Emit the list of all players to ALL connected clients
    const list = Array.from(players.values()).map((p) => p.name);
    io.emit("playersList", list);
  });

  socket.on("disconnect", () => {
    players.delete(socket.id);

    // Emit updated list when someone disconnects
    const list = Array.from(players.values()).map((p) => p.name);
    io.emit("playersList", list);
  });
}
