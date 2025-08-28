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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
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
          "bg-linear-to-r from-sky-600 to-sky-700 px-4 py-1 rounded transition mb-5 mt-6",
          !nickname
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:opacity-80"
        )}
      >
        {mode === "login" ? "Login" : "Register"}
      </button>

      <span> - or - </span>

      <button
        className="cursor-pointer bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:w-full after:origin-bottom after:scale-x-0 after:bg-sky-500 after:transition-transform after:duration-300 after:ease-[cubic-bezier(0.65_0.05_0.36_1)] hover:after:origin-bottom hover:after:scale-x-100 mt-5"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Register" : "Log in"}
      </button>
    </section>
  );
};

export default AuthForm;
