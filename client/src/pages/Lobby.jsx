import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayerStore } from "../stores/usePlayerStore";
import socket from "../socket";
import clsx from "clsx";

const Lobby = () => {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [inputName, setInputName] = useState("");
  const [errorInput, setErrorInput] = useState(false);
  const [playerList, setPlayerList] = useState([]);
  const [canJoin, setCanJoin] = useState(false);

  const { name, setName } = usePlayerStore();

  useEffect(() => {
    socket.on("playersList", (players) => {
      setPlayerList(players);
      setCanJoin(players.length === 2);
    });

    return () => {
      socket.off("playersList");
    };
  }, []);

  const handleRegister = () => {
    if (!inputName.trim()) {
      setErrorInput(true);
      return;
    }

    socket.emit("registerPlayer", inputName); // Send name to server
    setName(inputName); // Save name in Zustand
    setRegistered(true);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {registered ? (
        <>
          <h1 className="text-4xl mb-4">👋 Hi, {name}</h1>
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
              className="bg-cyan-600 px-4 py-1 rounded hover:bg-cyan-700 transition"
            >
              Join Match
            </button>
          )}
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
