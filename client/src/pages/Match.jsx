import { useEffect, useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import socket from "../socket";

const Match = () => {
  const [result, setResult] = useState("");
  const [players, setPlayers] = useState([]);

  const { name, balance, setBalance } = usePlayerStore();

  useEffect(() => {
    socket.emit("startMatch");

    socket.on("matchPlayers", (list) => {
      setPlayers(list); // [{ name, balance }]
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
        {players.map((p, index) => {
          const isCurrentPlayer = p.name === name;
          return (
            <li key={index}>
              👤 {p.name} – 💰 ${isCurrentPlayer ? balance : p.balance}
            </li>
          );
        })}
      </ul>

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
