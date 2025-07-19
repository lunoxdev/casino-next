import { useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useRoomsStore } from "../stores/useRoomsStore";
import { useLobbySocket } from "../hooks/useLobbySocket";
import { useNavigate } from "react-router-dom";
import SignUp from "../components/SignUp";
import socket from "../socket";

const Lobby = () => {
  const navigate = useNavigate();
  const { name, balance, registered, token, signOut } = usePlayerStore();
  const { myRoom, availableRooms, setRoomId, clearRoom } = useRoomsStore();

  const [players, setPlayers] = useState([]);

  const { roomId, roomPlayers } = myRoom;

  useLobbySocket({ setPlayers }); // ⬅️ Socket hook for lobby events

  const handleSignOut = () => {
    socket.emit("signOut", token); // Notify server to remove player
    signOut(); // ⚠️ CHECK THIS
    clearRoom(); // ⚠️ CHECK THIS
    setRoomId(null); // ⚠️ CHECK THIS
  };

  const handleCreateRoom = () => {
    const newRoomId = crypto.randomUUID();
    setRoomId(newRoomId);

    socket.emit("createRoom", {
      roomId: newRoomId,
      name,
      balance,
    });
  };

  const handleJoin = (roomIdToJoin) => {
    socket.emit("joinRoom", {
      roomId: roomIdToJoin,
      name,
      balance,
    });
    setRoomId(roomIdToJoin);
  };

  const handleStartMatch = () => {
    navigate("/match");
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {registered ? (
        <>
          <h1 className="text-4xl mb-2">
            Hi,{" "}
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-600 inline-block text-transparent bg-clip-text">
              {name}
            </span>
          </h1>
          <p className="text-lg mb-4">
            Your balance:{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 inline-block text-transparent bg-clip-text font-semibold">
              ${balance}
            </span>
          </p>

          <p className="font-bold text-lg">Players Connected:</p>
          <ul className="mb-4 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
            {players.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>

          <p className="font-bold text-lg">All Rooms:</p>
          {availableRooms.length > 0 && (
            <ul>
              {availableRooms
                .filter((room) => !room.players.some((p) => p.name === name))
                .map((room, index) => (
                  <li
                    key={index}
                    className="border border-white rounded-md px-6 py-2 my-2"
                  >
                    Room: {room.roomId} — Host: {room.host.name}
                    <br />
                    {/* Display join button if the player is not the host and if there are not 2 players yet */}
                    {room.host.name !== name &&
                      !room.players.some((p) => p.name === name) && (
                        <button
                          onClick={() => handleJoin(room.roomId)}
                          className="border border-white rounded-md px-6 py-1 mt-4"
                        >
                          Join
                        </button>
                      )}
                  </li>
                ))}
            </ul>
          )}

          <br />

          <p className="font-bold text-lg">My Room:</p>
          {roomId && (
            <>
              <p>Room ID: {roomId}</p>
              <ul>
                {roomPlayers.map((p, index) => (
                  <li key={index}>{p.name}</li>
                ))}
              </ul>
            </>
          )}

          <br />

          {roomId && roomPlayers.length === 2 ? (
            <button
              onClick={handleStartMatch}
              className="bg-cyan-600 px-4 py-1 rounded hover:bg-cyan-700 transition mb-4"
            >
              Start Match
            </button>
          ) : (
            <button
              onClick={handleCreateRoom}
              className="bg-lime-600 px-4 py-1 rounded hover:bg-lime-700 transition mb-4"
            >
              Create Room
            </button>
          )}

          <br />

          <button
            onClick={handleSignOut}
            className="text-red-600 px-4 py-1 rounded hover:underline transition mb-4"
          >
            Sign Out
          </button>
        </>
      ) : (
        <SignUp />
      )}
    </div>
  );
};

export default Lobby;
