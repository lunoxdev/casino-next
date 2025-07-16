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

  socket.on("playerDisconnected", () => {
    removePlayer(socket.id);
    io.emit("updatePlayers", getPlayersList());
  });
}
