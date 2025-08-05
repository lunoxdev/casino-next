import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";

export default function SignUp() {
  const [inputNickname, setInputNickname] = useState("");
  const register = usePlayerStore((state) => state.register);
  const login = usePlayerStore((state) => state.login);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    const trimmedNickname = inputNickname.trim();
    const validNickname = /^[a-zA-Z0-9]+$/.test(trimmedNickname);

    console.log("📝 Submitted nickname:", trimmedNickname);

    if (!trimmedNickname) {
      setMessage("⚠️ Nickname cannot be empty.");
      return;
    }

    if (trimmedNickname.length < 3 || trimmedNickname.length > 12) {
      setMessage("⚠️ Nickname must be between 3 and 12 characters.");
      return;
    }

    if (!validNickname) {
      setMessage("⚠️ Nickname can only contain letters and numbers.");
      return;
    }

    try {
      await register(trimmedNickname);
      setMessage("");
    } catch (err) {
      console.warn("⚠️ Register failed:", err.message);

      if (err.message.includes("already taken")) {
        try {
          await login(trimmedNickname);
          setMessage("");
        } catch (loginErr) {
          console.warn("⚠️ Login failed:", loginErr.message);
          setMessage(loginErr.message);
        }
      } else {
        setMessage(err.message);
      }
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
        name="nickname"
        value={inputNickname}
        onChange={(e) => setInputNickname(e.target.value)}
        placeholder="Enter your nickname"
        maxLength={12}
        className="border border-sky-200/30 hover:border-sky-600/80 p-2 mb-4 rounded-md text-center"
      />

      <button
        onClick={handleSubmit}
        className="bg-linear-to-r from-sky-600 to-sky-700 hover:opacity-80 px-4 py-1 rounded transition mb-4 cursor-pointer"
      >
        Enter
      </button>

      {message && <p className="text-center text-red-500">{message}</p>}
    </>
  );
}
