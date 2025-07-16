import {
  addPlayer,
  removePlayer,
  getPlayersList,
} from "../state/playersStore.js";

export default function lobbySockets(socket, io) {
  socket.on("playerJoined", (playerData) => {
    const { token } = playerData;
    if (!token) return;

    addPlayer(token, playerData);
    io.emit("updatePlayers", getPlayersList());
    console.log(`🟢 Player ${playerData.name} has joined`);
  });

  socket.on("signOut", (token) => {
    if (!token) return;

    removePlayer(token);
    io.emit("updatePlayers", getPlayersList());
    console.log(`🔴 Player has signed out`);
  });
}
