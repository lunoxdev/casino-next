import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";
import clsx from "clsx";

const Lobby = () => {
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [playerList, setPlayerList] = useState([]);
  const [errorInput, setErrorInput] = useState(false);

  useEffect(() => {
    socket.on("playersList", (players) => {
      setPlayerList(players);
    });

    return () => {
      socket.off("playersList");
    };
  }, []);

  const handleRegister = () => {
    if (!name.trim()) {
      setErrorInput(true);
      return;
    }
    setDisplayName(name);
    socket.emit("registerPlayer", name);
    setRegistered(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {registered ? (
        <>
          <h1 className="text-4xl mb-4">👋 Hi, {displayName}</h1>
          <p className="italic font-bold">👥 Players Connected:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-300">
            {playerList.map((p, index) => (
              <li key={index}>{p}</li>
            ))}
          </ul>
          <button
            onClick={() => navigate("/match")}
            className="bg-cyan-600 px-4 py-1 rounded hover:bg-cyan-700 transition"
          >
            Create Match
          </button>
        </>
      ) : (
        <>
          <h1 className="text-4xl mb-2">Welcome to VIP Casino</h1>
          <input
            required={true}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
