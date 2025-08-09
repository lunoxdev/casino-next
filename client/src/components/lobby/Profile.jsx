import { useEffect, useState } from "react";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAutoRefreshToken } from "../../hooks/useAutoRefreshToken";
import { useLobbySocket } from "../../hooks/useLobbySocket";
import { useProfileStore } from "../../stores/useProfileStore";
import { useRoomsStore } from "../../stores/useRoomsStore";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import avatar from "../../assets/avatar.webp";

const Profile = () => {
  const { uuid, logOut } = useAuthStore.getState();
  const { nickname, balance, fetchProfile, clearProfile } = useProfileStore();
  const [players, setPlayers] = useState([]);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const { myRoom, availableRooms, setRoomId, clearRoom } = useRoomsStore();
  const { roomId, roomPlayers, gameName } = myRoom;
  const navigate = useNavigate();

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
    clearRoom();
    clearProfile();
    logOut();
    socket.emit("logOut", { uuid });
  };

  const handleCreateRoom = () => {
    const newRoomId = crypto.randomUUID();
    socket.emit("createRoom", {
      roomId: newRoomId,
      uuid,
      nickname,
      balance,
    });
    setRoomId(newRoomId);
  };

  const handleJoin = (roomIdToJoin) => {
    socket.emit("joinRoom", {
      roomId: roomIdToJoin,
      uuid,
      nickname,
      balance,
    });
    setRoomId(roomIdToJoin);
  };

  const handleStartMatch = () => {
    if (roomPlayers.length < 2) return;
    navigate("/match");
  };

  const handleLeave = () => {
    if (!roomId || !nickname) return;
    socket.emit("leaveRoom", { roomId, nickname });
    clearRoom();
  };

  return (
    <div className="flex flex-col justify-between lg:justify-center w-4xl lg:w-3xl p-1 h-full">
      {/* Profile */}
      <section className="flex justify-between">
        <div className="flex space-x-4">
          <img src={avatar} alt="avatar" className="w-16 h-16" />
          <h1 className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text font-semibold">
            {nickname}
          </h1>
        </div>

        <div className="flex justify-center items-start gap-8">
          <p className="font-medium gap-1">
            Online:{" "}
            <span className="bg-gradient-to-r from-lime-500 via-lime-400 to-lime-500 text-transparent bg-clip-text font-semibold">
              {players.length}
            </span>
          </p>

          <button className="font-semibold bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-transparent bg-clip-text hover:opacity-80 transition-opacity flex items-start gap-1">
            ${balance}
            <span className="text-lime-500 font-bold text-xl -mt-1">+</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-4 w-lg mx-auto my-0 lg:my-20">
        {roomId && (
          <div className="flex flex-col border border-sky-200/30 rounded-md px-6 py-2 my-2">
            <p>{gameName}</p>
            <ul className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
              {roomPlayers.map((p, index) => (
                <li key={index}>{p.nickname}</li>
              ))}
            </ul>

            {roomPlayers.length === 2 ? (
              <button
                onClick={handleStartMatch}
                className="bg-cyan-600 px-4 py-1 rounded hover:bg-cyan-700 transition mt-4 cursor-pointer"
              >
                Start Match
              </button>
            ) : (
              <button
                onClick={handleLeave}
                className="bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition mt-4 cursor-pointer"
              >
                Leave Room
              </button>
            )}
          </div>
        )}

        {availableRooms.length > 0 && (
          <ul>
            {availableRooms
              .filter(
                (room) => !room.players.some((p) => p.nickname === nickname)
              )
              .map((room, index) => (
                <li
                  key={index}
                  className="border border-sky-200/30 rounded-md px-6 py-2 my-2"
                >
                  {room.gameName}
                  <br />
                  <span className="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
                    {room.host.nickname}
                  </span>
                  <br />
                  {room.host.nickname !== nickname &&
                    !room.players.some((p) => p.nickname === nickname) && (
                      <button
                        onClick={() => handleJoin(room.roomId)}
                        className="bg-sky-200/30 hover:bg-sky-600/80 rounded-md px-6 py-1 mt-4 cursor-pointer"
                      >
                        Join
                      </button>
                    )}
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="flex justify-between items-end">
        <button
          onClick={handleLogOut}
          className="text-xs text-red-600 rounded hover:underline transition cursor-pointer"
        >
          Log Out
        </button>

        {!roomId && (
          <button
            onClick={handleCreateRoom}
            className="w-1/6 bg-lime-600 px-4 py-1 rounded hover:bg-lime-700 transition cursor-pointer"
          >
            Create Room
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
