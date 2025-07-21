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
      <h1 className="text-3xl mb-4">
        ⚔{" "}
        <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text">
          Battle
        </span>{" "}
        ⚔
      </h1>

      <div className="grid grid-cols-3 gap-4 items-center text-center text-white text-lg font-semibold mb-4">
        {/* Player */}
        <div>
          {players[0] ? (
            <>
              <p className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
                {players[0].name}
              </p>
              <p>💰 ${players[0].balance}</p>
            </>
          ) : (
            <p>Waiting for you...</p>
          )}
        </div>

        {/* VS Text */}
        <div>
          <p className="text-2xl bg-gradient-to-r from-gray-500 via-gray-300 to-gray-500 inline-block text-transparent bg-clip-text">
            VS
          </p>
        </div>

        {/* Opponent */}
        <div>
          {players[1] ? (
            <>
              <p className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
                {players[1].name}
              </p>
              <p>💰 ${players[1].balance}</p>
            </>
          ) : (
            <p>Waiting for opponent...</p>
          )}
        </div>
      </div>

      <button
        onClick={handleSpin}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-80 px-6 py-1 rounded transition font-bold cursor-pointer"
      >
        🎰 SPIN
      </button>

      {resultText && <p className="mt-4 text-lg">{resultText}</p>}
    </div>
  );
};

export default Match;
