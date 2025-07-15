// Lobby sockets events
import { players } from "../state/playersStore.js";

export default function lobbySockets(socket, io) {
  socket.on("registerPlayer", (name) => {
    const me = { name, balance: 1000 };

    players.set(socket.id, me);

    socket.emit("welcome", me);
    console.log(`📝 Player "${name}" registered with ${me.balance} balance`);

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
