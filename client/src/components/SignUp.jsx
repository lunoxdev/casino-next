import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";

export default function SignUp() {
  const [inputName, setInputName] = useState("");
  const register = usePlayerStore((state) => state.register);
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    const trimmedName = inputName.trim();
    const validName = /^[a-zA-Z0-9]+$/.test(trimmedName);

    if (!trimmedName) {
      setMessage("⚠️ Name cannot be empty.");
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 12) {
      setMessage("⚠️ Name must be between 3 and 12 characters.");
      return;
    }

    if (!validName) {
      setMessage("⚠️ Name can only contain letters and numbers.");
      return;
    }

    try {
      await register(trimmedName);
      setMessage("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <>
      <h1 className="text-4xl mb-4">
        Welcome to{" "}
        <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text">
          PVP Casino
        </span>
      </h1>
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        placeholder="Enter your name"
        maxLength={12}
        className="border border-sky-200/30 hover:border-sky-600/80 p-2 mb-4 rounded-md text-center"
      />
      <button
        onClick={handleRegister}
        className="bg-linear-to-r from-sky-600 to-sky-700 hover:opacity-80 px-4 py-1 rounded transition mb-4 cursor-pointer"
      >
        Register
      </button>

      {message && <p className="text-center text-red-500">{message}</p>}
    </>
  );
}
