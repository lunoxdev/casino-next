// components/SignUp.jsx
import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";

export default function SignUp() {
  const [inputName, setInputName] = useState("");
  const register = usePlayerStore((state) => state.register);

  const handleRegister = () => {
    if (inputName.trim()) {
      register(inputName);
    }
  };

  return (
    <>
      <h1 className="text-4xl mb-4">Welcome to VIP Casino</h1>
      <input
        type="text"
        value={inputName}
        onChange={(e) => setInputName(e.target.value)}
        placeholder="Enter your name"
        className="border border-sky-200/30 hover:border-sky-600/80 p-2 mb-4 rounded-md text-center"
      />
      <button
        onClick={handleRegister}
        className="bg-linear-to-r from-sky-600 to-sky-700 hover:opacity-80 px-4 py-1 rounded transition mb-4"
      >
        Register
      </button>
    </>
  );
}
