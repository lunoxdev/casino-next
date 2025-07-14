import { useEffect, useState } from "react";
import socket from "../socket";

const Match = () => {
  const [result, setResult] = useState("");

  useEffect(() => {
    socket.on("spinResult", (msg) => {
      setResult(msg);
    });

    return () => {
      socket.off("spinResult");
    };
  }, []);

  const handleSpin = () => {
    socket.emit("spin");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">PvP Battle</h1>
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
