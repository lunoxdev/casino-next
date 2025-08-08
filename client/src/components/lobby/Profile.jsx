import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAutoRefreshToken } from "../../hooks/useAutoRefreshToken";
import { useLobbySocket } from "../../hooks/useLobbySocket";
import { useProfileStore } from "../../stores/useProfileStore";
import socket from "../../socket";

const Profile = () => {
  const { uuid, logOut } = useAuthStore.getState();
  const { nickname, balance, fetchProfile, clearProfile } = useProfileStore();
  const [players, setPlayers] = useState([]);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useAutoRefreshToken();

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
      setProfileLoaded(true);
    };
    loadProfile();
  }, [fetchProfile]);

  useLobbySocket({ setPlayers, enabled: profileLoaded });

  const handleLogOut = () => {
    socket.emit("logOut", { uuid });
    clearProfile();
    logOut();
    socket.disconnect();
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

      <ul className="mb-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
        {players.map((player, index) => (
          <li key={index}>{player.nickname}</li>
        ))}
      </ul>

      <button
        onClick={handleLogOut}
        className="text-red-600 px-4 py-1 rounded hover:underline transition mb-4 cursor-pointer"
      >
        Log Out
      </button>
    </>
  );
};

export default Profile;
