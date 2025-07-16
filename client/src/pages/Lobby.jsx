import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore";
import SignUp from "../components/SignUp";
import socket from "../socket";

const Lobby = () => {
  const navigate = useNavigate();
  const { name, balance, registered, token, signOut } = usePlayerStore();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const rejoin = () => {
      if (registered && token) {
        socket.emit("playerJoined", { name, balance, token });
      }
    };

    socket.on("connection", rejoin);
    rejoin(); // also on first mount

    socket.on("updatePlayers", (updatedList) => {
      setPlayers(updatedList);
    });

    return () => {
      socket.off("connection", rejoin);
      socket.off("updatePlayers");
    };
  }, [registered, name, balance, token]);

  const handleSignOut = () => {
    socket.emit("signOut", token); // Notify server to remove player
    signOut(); // Zustand cleanup
  };

  const handleStartMatch = () => {
    navigate("/match");
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

          {/*show Start Match button if there are two players*/}
          {players.length === 2 && (
            <button
              onClick={handleStartMatch}
              className="bg-cyan-600 px-4 py-1 rounded hover:bg-cyan-700 transition mb-4"
            >
              Start Match
            </button>
          )}

          <button
            onClick={handleSignOut}
            className="bg-red-700 px-4 py-1 rounded hover:bg-red-800 transition mb-4"
          >
            Sign Out
          </button>
        </>
      ) : (
        <SignUp />
      )}
    </div>
  );
};

export default Lobby;