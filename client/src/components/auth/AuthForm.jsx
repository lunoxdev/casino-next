import { useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { InputLightEffect } from "../common/InputLightEffect";
import clsx from "clsx";

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
    <section className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl mb-4 bg-gradient-to-r from-white via-sky-300 to-sky-600 inline-block text-transparent bg-clip-text">
        Welcome
      </h1>

      <InputLightEffect
        value={nickname}
        onChange={(e) => setNickname(e.target.value.replace(/\s/g, ""))}
      />

      {error && (
        <p className="text-center text-red-500 mb-4 animate-pulse">{error}</p>
      )}

      <button
        disabled={!nickname}
        onClick={handleSubmit}
        className={clsx(
          "bg-linear-to-r from-sky-600 to-sky-700 px-4 py-1 rounded transition mb-4 mt-6",
          !nickname ? "opacity-50" : "cursor-pointer hover:opacity-80"
        )}
      >
        {mode === "login" ? "Login" : "Register"}
      </button>

      <p
        className="text-sm cursor-pointer bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login"
          ? "No account? Register"
          : "Already have an account? Log in"}
      </p>
    </section>
  );
};

export default AuthForm;
