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

    const wonSomething = Math.random() < 0.8;
    const amount = wonSomething ? Math.floor(Math.random() * 100) + 1 : 0;

    if (amount > 0) {
      const resultText = `🎉 You won $${amount}!`;

      socket.emit("spinResult", {
        token,
        message: resultText,
        balance: player.balance,
      });

      setTimeout(() => {
        player.balance += amount;
        players.set(token, player);

        io.emit("matchPlayers", Array.from(players.values()));
      }, 3000);
    }
  });
}
