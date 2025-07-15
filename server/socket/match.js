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
      result = "🎉 You win $100!";
      amount = 100;
    } else {
      result = "💀 You lose $100!";
      amount = -100;
    }

    player.balance += amount; // Update player's balance in backend

    socket.emit("spinResult", {
      message: result,
      newBalance: player.balance,
    });
  });
}
