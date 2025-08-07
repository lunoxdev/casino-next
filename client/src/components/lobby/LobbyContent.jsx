import { useEffect } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAutoRefreshToken } from "../../hooks/useAutoRefreshToken";
import { useProfileStore } from "../../stores/useProfileStore";
import socket from "../../socket";

const LobbyContent = () => {
  const { uuid, token, logOut } = useAuthStore();
  const { nickname, balance, fetchProfile } = useProfileStore();

  useAutoRefreshToken();

  console.log("valores de auth", uuid, token);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  console.log("valores de auth 2", uuid, token);

  const handleLogOut = () => {
    socket.emit("logOut", { uuid });
    logOut();
  };

  return (
    <>
      <h1 className="text-4xl mb-2">
        Hi,{" "}
        <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text">
          {nickname}
        </span>
      </h1>

      <p className="text-lg mb-4">
        Your balance:{" "}
        <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 inline-block text-transparent bg-clip-text font-semibold">
          ${balance}
        </span>
      </p>

      <button
        onClick={handleLogOut}
        className="text-red-600 px-4 py-1 rounded hover:underline transition mb-4 cursor-pointer"
      >
        Log Out
      </button>
    </>
  );
};

export default LobbyContent;
