// Lobby sockets events
import { players } from "../state/playersStore.js";

export default function lobbySockets(socket, io) {
  socket.on("registerPlayer", (name) => {
    const me = { name, balance: 1000 };

    players.set(socket.id, me);

    socket.emit("welcome", me);
    console.log(`📝 Player "${name}" registered with ${me.balance} balance`);

    // Add player to the list
    const list = Array.from(players.values()).map((p) => p.name);
    io.emit("playersList", list);
  });

  socket.on("disconnect", () => {
    players.delete(socket.id);
    console.log(`🔴 Player with socket ID ${socket.id} disconnected`);

    // Remove player from the list
    const list = Array.from(players.values()).map((p) => p.name);
    io.emit("playersList", list);
  });
}
