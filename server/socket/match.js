import { players } from "../state/playersStore.js";

export default function matchSockets(socket, io) {
  socket.on("startMatch", () => {
    // Emit player list to all players
    const list = Array.from(players.values());
    socket.emit("matchPlayers", list);
  });

  socket.on("spin", ({ token }) => {
    const player = players.get(token);
    if (!player) return;

    const win = Math.random() < 0.5;
    const amount = Math.floor(Math.random() * 100) + 1;
    const delta = win ? amount : -amount;

    player.balance += delta;
    players.set(token, player);

    const resultText = win
      ? `🎉 You won $${amount}!`
      : `💀 You lost $${amount}.`;

    // Emit result individually to the player
    socket.emit("spinResult", {
      message: resultText,
      balance: player.balance,
    });

    // Emit updated player list to all players
    io.emit("matchPlayers", Array.from(players.values()));
  });
}
