import { players } from "../state/playersStore.js";

export default function matchSockets(socket) {
  socket.on("startMatch", () => {
    const playersList = Array.from(players.values());
    socket.emit("matchPlayers", playersList); // Only emit to the player who started the match
  });

  socket.on("spin", () => {
    const player = players.get(socket.id);
    if (!player) return;

    let result, amount;
    if (Math.random() < 0.5) {
      amount = Math.floor(Math.random() * 100) + 1;
      result = `🎉 You win ${amount}!`;
    } else {
      amount = -1 * (Math.floor(Math.random() * 100) + 1);
      result = `💀 You lose ${Math.abs(amount)}!`;
    }

    player.balance += amount; // Update player's balance in backend

    socket.emit("spinResult", {
      message: result,
      newBalance: player.balance,
    });

    // Emit updated player list to all players
    const playersList = Array.from(players.values());
    socket.broadcast.emit("matchPlayers", playersList);
    socket.emit("matchPlayers", playersList);
  });
}
