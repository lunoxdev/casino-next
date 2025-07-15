import { useEffect, useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import socket from "../socket";

const Match = () => {
  const [result, setResult] = useState("");
  const [players, setPlayers] = useState([]);
  const { balance, setBalance } = usePlayerStore();

  useEffect(() => {
    socket.emit("startMatch"); // Notify server to start match

    socket.on("matchPlayers", (list) => {
      setPlayers(list); // List of players
    });

    socket.on("spinResult", ({ message, newBalance }) => {
      setResult(message);
      setBalance(newBalance);
    });

    return () => {
      socket.off("spinResult");
      socket.off("matchPlayers");
    };
  }, [setBalance]);

  const handleSpin = () => {
    socket.emit("spin");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">PvP Battle</h1>

      <ul className="mb-4 text-gray-300">
        {players.map((p, index) => (
          <li key={index}>
            👤 {p.name} – 💰 ${p.balance}
          </li>
        ))}
      </ul>

      <p className="mb-4 text-xl">Your Balance: ${balance}</p>

      <button
        onClick={handleSpin}
        className="bg-cyan-600 px-6 py-3 rounded hover:bg-cyan-700 transition"
      >
        🎰 Spin
      </button>

      <p className="mt-5 text-xl">{result}</p>
    </div>
  );
};

export default Match;
