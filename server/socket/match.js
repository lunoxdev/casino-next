// Match socket events
export default function matchSockets(socket) {
    socket.on("spin", () => {
      const result = Math.random() < 0.5
        ? "🎉 You win $100!"
        : "💀 You lose $100!";
      socket.emit("spinResult", result);
    });
  }
  