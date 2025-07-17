import { useEffect, useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import socket from "../socket";

const Match = () => {
  const { name, balance, setBalance, token, registered } = usePlayerStore();
  const [players, setPlayers] = useState([]);
  const [resultText, setResultText] = useState("");

  useEffect(() => {
    if (registered && token) {
      socket.emit("startMatch");

      socket.emit("playerJoined", { name, balance, token }); // In case the player reload
    }

    socket.on("matchPlayers", (list) => {
      setPlayers(list);
    });

    socket.on("spinResult", ({ message }) => {
      setResultText(message);
      setBalance(balance);
    });

    return () => {
      socket.off("matchPlayers");
      socket.off("spinResult");
    };
  }, [registered, token, name, balance, setBalance]);

  const handleSpin = () => {
    socket.emit("spin", { token });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">PvP Battle</h1>

      <ul className="mb-4 text-gray-300">
        {players.map((player, index) => (
          <li key={index}>
            {player.name} 💰 ${player.balance}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSpin}
        className="bg-linear-to-r from-sky-600 to-sky-700 hover:opacity-80 px-6 py-1 rounded transition"
      >
        🎰 Spin
      </button>

      {resultText && <p className="mt-4 text-lg">{resultText}</p>}
    </div>
  );
};

export default Match;
