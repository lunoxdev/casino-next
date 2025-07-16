import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore";
import socket from "../socket";
import clsx from "clsx";

const Lobby = () => {
  const navigate = useNavigate();
  const [inputName, setInputName] = useState("");
  const [errorInput, setErrorInput] = useState(false);
  const [playerList, setPlayerList] = useState([]);
  const [canJoin, setCanJoin] = useState(false);

  const {
    name,
    setName,
    balance,
    setBalance,
    registered,
    setRegistered,
    reset,
  } = usePlayerStore();

  // Listen for welcome event to set balance and registered state
  useEffect(() => {
    socket.on("welcome", ({ balance }) => {
      setBalance(balance);
    });

    socket.on("playersList", (players) => {
      setPlayerList(players);
      setCanJoin(players.length === 2);
    });

    return () => {
      socket.off("playersList");
    };
  }, [setBalance]);

  const handleRegister = () => {
    if (!inputName.trim()) {
      setErrorInput(true);
      return;
    }

    socket.emit("registerPlayer", inputName); // Send name to server
    setName(inputName); // Save name in Zustand
    setRegistered(true);
    console.log(`🟢 Player ${inputName} registered`);
  };

  const handleDisconnect = () => {
    reset(); // Reset the player store
    setInputName("");
    socket.disconnect(); // Notify server of disconnection
    console.log(`🔴 Player ${name} disconnected`);
    navigate("/"); // Redirect to Lobby

    // 🔄 Reconnect the socket after a short delay
    setTimeout(() => {
      socket.connect();
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {registered ? (
        <>
          <h1 className="text-4xl mb-4">👋 Hi, {name}</h1>
          <p className="text-lg mb-2">Your balance: ${balance}</p>
          <p className="italic font-bold">👥 Players Connected:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            {playerList.map((p, index) => (
              <li key={index}>{p}</li>
            ))}
          </ul>
          {canJoin && (
            <button
              onClick={() => {
                navigate("/match");
              }}
              className="bg-cyan-600 px-4 py-1 mb-2 rounded hover:bg-cyan-700 transition"
            >
              Join Match
            </button>
          )}
          <button onClick={handleDisconnect} className="hover:underline">
            Disconnect
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl mb-2">Welcome to VIP Casino</h1>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder={clsx(
              errorInput ? "Invalid nickname" : "Create your nickname"
            )}
            className={`px-4 py-2 rounded-md mb-4 border text-center ${
              errorInput ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            onClick={handleRegister}
            className="bg-cyan-600 px-4 py-1 rounded hover:bg-cyan-700 transition mb-4"
          >
            Register
          </button>
        </>
      )}
    </div>
  );
};

export default Lobby;
