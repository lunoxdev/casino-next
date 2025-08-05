import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useRoomsStore } from "../stores/useRoomsStore";
import { useLobbySocket } from "../hooks/useLobbySocket";
import { useNavigate } from "react-router-dom";
import SignUp from "../components/SignUp";
import socket from "../socket";
import { useAutoRefreshToken } from "../hooks/useAutoRefreshToken";

const Lobby = () => {
  const navigate = useNavigate();
  const { nickname, balance, registered, token, logOut } = usePlayerStore();
  const { myRoom, availableRooms, setRoomId, clearRoom } = useRoomsStore();
  const { roomId, roomPlayers, gameName } = myRoom;

  const [players, setPlayers] = useState([]);
  useAutoRefreshToken();
  useLobbySocket({ setPlayers });

  const handleLogOut = () => {
    socket.emit("logOut", { token, nickname });
    logOut();
    clearRoom();
    localStorage.removeItem("player-storage");
  };

  const handleCreateRoom = () => {
    const newRoomId = crypto.randomUUID();
    socket.emit("createRoom", {
      roomId: newRoomId,
      nickname,
      balance,
    });
    setRoomId(newRoomId);
  };

  const handleJoin = (roomIdToJoin) => {
    socket.emit("joinRoom", {
      roomId: roomIdToJoin,
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
    <div className="flex flex-col items-center justify-center">
      {registered ? (
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

          <p className="font-bold text-lg">Total Players Connected:</p>
          <ul className="mb-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
            {players.map((player, index) => (
              <li key={index}>{player.nickname}</li>
            ))}
          </ul>

          <p className="font-bold text-lg">My Room:</p>
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

          {!roomId && (
            <button
              onClick={handleCreateRoom}
              className="bg-lime-600 px-4 py-1 rounded hover:bg-lime-700 transition mt-2 mb-4 cursor-pointer"
            >
              Create Room
            </button>
          )}

          <br />

          <p className="font-bold text-lg">All Rooms:</p>
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

          <br />

          <button
            onClick={handleLogOut}
            className="text-red-600 px-4 py-1 rounded hover:underline transition mb-4 cursor-pointer"
          >
            Log Out
          </button>
        </>
      ) : (
        <SignUp />
      )}
    </div>
  );
};

export default Lobby;
