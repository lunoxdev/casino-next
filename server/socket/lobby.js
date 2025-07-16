import {
  addPlayer,
  removePlayer,
  getPlayersList,
} from "../state/playersStore.js";

export default function lobbySockets(socket, io) {
  socket.on("playerJoined", (playerData) => {
    const { token } = playerData;
    if (!token) return;

    const alreadyConnected = getPlayersList().some((p) => p.token === token);
    if (!alreadyConnected) {
      addPlayer(token, playerData);
      console.log(`🟢 Player ${playerData.name} has joined`);
    }

    io.emit("updatePlayers", getPlayersList());
  });

  socket.on("signOut", (token) => {
    if (!token) return;

    removePlayer(token);
    io.emit("updatePlayers", getPlayersList());
    console.log(`🔴 Player has signed out`);
  });
}
