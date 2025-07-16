import { useEffect, useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import SignUp from "../components/SignUp";
import socket from "../socket";

const Lobby = () => {
  const { name, balance, registered, disconnect } = usePlayerStore();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    socket.on("updatePlayers", (updatedList) => {
      setPlayers(updatedList);
    });
    return () => {
      socket.off("updatePlayers");
    };
  }, []);

  useEffect(() => {
    if (registered) {
      socket.emit("playerJoined", { name, balance });
    }
  }, [registered, name, balance]);

  const handleDisconnect = () => {
    socket.emit("playerDisconnected", name); // Disconnect player from server
    disconnect(); // Reset player state in Zustand
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {registered ? (
        <>
          <h1 className="text-4xl mb-4">👋 Hi, {name}</h1>
          <p className="text-lg mb-2">Your balance: ${balance}</p>

          <p className="italic font-bold mt-4">👥 Players Connected:</p>
          <ul className="mb-4">
            {players.map((player, index) => (
              <li key={index}>
                {player.name} 💰 ${player.balance}
              </li>
            ))}
          </ul>

          <button
            onClick={handleDisconnect}
            className="bg-red-700 px-4 py-1 rounded hover:bg-red-800 transition mb-4"
          >
            Disconnect
          </button>
        </>
      ) : (
        <SignUp />
      )}
    </div>
  );
};

export default Lobby;