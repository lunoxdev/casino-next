import { useEffect, useState } from "react";
import ProfileHeader from "./ProfileHeader";
import RoomPanel from "./RoomPanel";
import GamesList from "./GamesList";
import AvailableRoomsList from "./AvailableRoomsList";
import { useAuthStore } from "../../stores/useAuthStore";
import { useAutoRefreshToken } from "../../hooks/useAutoRefreshToken";
import { useLobbySocket } from "../../hooks/useLobbySocket";
import { useProfileStore } from "../../stores/useProfileStore";
import { useRoomsStore } from "../../stores/useRoomsStore";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";

const LobbyHome = () => {
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

  const handleCreateRoom = (gameName) => {
    const newRoomId = crypto.randomUUID();
    socket.emit("createRoom", {
      roomId: newRoomId,
      uuid,
      nickname,
      balance,
      gameName,
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
    navigate("/match", { state: { gameName } });
  };

  const handleLeave = () => {
    if (!roomId || !nickname) return;
    socket.emit("leaveRoom", { roomId, nickname });
    clearRoom();
  };

  return (
    <div className="flex flex-col justify-between lg:justify-center w-4xl lg:w-3xl h-full">
      {/* Profile Header */}
      <ProfileHeader
        nickname={nickname}
        balance={balance}
        players={players}
        handleLogOut={handleLogOut}
      />

      <div className="grid grid-cols-2 gap-4 w-full h-44 mx-auto my-2 bg-gradient-to-br from-transparent via-sky-500/5 to-sky-600/0 shadow-sky-950/10 shadow rounded-md px-2">
        {/* Room Panel */}
        <div>
          {roomId && (
            <RoomPanel
              gameName={gameName}
              roomPlayers={roomPlayers}
              handleStartMatch={handleStartMatch}
              handleLeave={handleLeave}
            />
          )}
        </div>

        {/* Available Rooms List */}
        <AvailableRoomsList
          availableRooms={availableRooms}
          nickname={nickname}
          handleJoin={handleJoin}
        />
      </div>

      {/* Games List */}
      <GamesList handleCreateRoom={handleCreateRoom} roomId={roomId} />
    </div>
  );
};

export default LobbyHome;
