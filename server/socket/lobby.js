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

  socket.on("playerDisconnected", (playerName) => {
    removePlayer(socket.id); // Puedes agregar lógica extra si el nombre importa
    io.emit("updatePlayers", getPlayersList());
  });

  socket.on("disconnect", () => {
    removePlayer(socket.id);
    io.emit("updatePlayers", getPlayersList());
  });
}
