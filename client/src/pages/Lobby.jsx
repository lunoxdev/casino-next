import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const Lobby = () => {
  const navigate = useNavigate();
  const [socketId, setSocketId] = useState("");

  useEffect(() => {
    socket.on("welcome", (id) => {
      setSocketId(id);
    });

    return () => {
      socket.off("welcome");
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-2">Welcome, {socketId}</h1>
      <button
        onClick={() => navigate("/match")}
        className="bg-cyan-600 px-6 py-3 rounded hover:bg-cyan-700 transition"
      >
        🔥 Create Match
      </button>
    </div>
  );
};

export default Lobby;
