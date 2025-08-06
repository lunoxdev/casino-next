import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";

const AuthForm = () => {
  const { login, register } = useAuthStore();
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login");

  const handleSubmit = async () => {
    setError("");

    const trimmedNickname = nickname.trim();
    const validNickname = /^[a-zA-Z0-9]+$/.test(trimmedNickname);

    if (!trimmedNickname) {
      setError("⚠️ Nickname cannot be empty.");
      return;
    }

    if (trimmedNickname.length < 3 || trimmedNickname.length > 12) {
      setError("⚠️ Nickname must be between 3 and 12 characters.");
      return;
    }

    if (!validNickname) {
      setError("⚠️ Nickname can only contain letters and numbers.");
      return;
    }

    try {
      if (mode === "login") {
        await login(nickname);
      } else {
        await register(nickname);
      }
    } catch (err) {
      setError(err.message);
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
        value={nickname}
        onChange={(e) => setNickname(e.target.value.replace(/\s/g, ""))}
        placeholder="Enter nickname"
        maxLength={12}
        className="border border-sky-200/30 hover:border-sky-600/80 p-2 mb-4 rounded-md text-center"
      />

      {error && (
        <p className="text-center text-red-500 mb-4 animate-pulse">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        className="bg-linear-to-r from-sky-600 to-sky-700 hover:opacity-80 px-4 py-1 rounded transition mb-4 cursor-pointer"
      >
        {mode === "login" ? "Login" : "Register"}
      </button>

      <p
        className="mt-2 text-sm cursor-pointer text-blue-600 hover:underline text-center"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "No account? Register"
          : "Already have an account? Log in"}
      </p>
    </>
  );
};

export default AuthForm;
