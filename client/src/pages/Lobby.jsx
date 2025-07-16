import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore";
import SignUp from "../components/SignUp";
import socket from "../socket";

const Lobby = () => {
  const navigate = useNavigate();
  const { name, balance, setBalance, registered, token, signOut } =
    usePlayerStore();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const rejoin = () => {
      if (registered && token) {
        socket.emit("playerJoined", { name, balance, token });
      }
    };

    socket.on("connect", rejoin);
    rejoin(); // also on first mount

    socket.on("updatePlayers", (updatedList) => {
      setPlayers(updatedList);

      const currentPlayer = updatedList.find((p) => p.token === token);
      if (currentPlayer) {
        setBalance(currentPlayer.balance);
      }
    });

    return () => {
      socket.off("connect", rejoin);
      socket.off("updatePlayers");
    };
  }, [registered, name, balance, setBalance, token]);

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
          <ul className="mb-4 text-green-500">
            {players.map((player, index) => (
              <li key={index}>{player.name}</li>
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
            className="text-red-600 px-4 py-1 rounded hover:underline transition mb-4"
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
