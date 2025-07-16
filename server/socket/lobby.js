import {
  addPlayer,
  removePlayer,
  getPlayersList,
} from "../state/playersStore.js";

export default function lobbySockets(socket, io) {
  socket.on("playerJoined", (playerData) => {
    addPlayer(socket.id, playerData);
    io.emit("updatePlayers", getPlayersList());
  });

  socket.on("signOut", () => {
    removePlayer(socket.id);
    io.emit("updatePlayers", getPlayersList());
    console.log(`🔴 Player has signed out`);
  });

  socket.on("disconnect", () => {
    removePlayer(socket.id);
    io.emit("updatePlayers", getPlayersList());
    console.log(`📡 Connection closed (network lost or switched).`);
  });
}
