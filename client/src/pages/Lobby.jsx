import { useEffect, useState } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useRoomsStore } from "../stores/useRoomsStore";
import SignUp from "../components/SignUp";
import socket from "../socket";

const Lobby = () => {
  const { name, balance, setBalance, registered, token, signOut } =
    usePlayerStore();
  const {
    myRoom,
    availableRooms,
    setMyRoom,
    setRoomId,
    setRoomPlayers,
    setAvailableRooms,
    clearRoom,
  } = useRoomsStore();

  const [players, setPlayers] = useState([]);

  const { roomId, roomPlayers } = myRoom;

  useEffect(() => {
    const rejoin = () => {
      if (registered && token) {
        socket.emit("playerJoined", { name, balance, token });
        socket.emit("getRooms");
      }
    };

    socket.on("connect", rejoin);
    rejoin();

    socket.on("updatePlayers", (updatedList) => {
      setPlayers(updatedList);

      const currentPlayer = updatedList.find((p) => p.token === token);
      if (currentPlayer) setBalance(currentPlayer.balance);
    });

    socket.on("roomCreated", ({ roomId, player }) => {
      setMyRoom(roomId, [player]);
    });

    socket.on("roomListUpdated", (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on("matchPlayers", (playersInRoom) => {
      setRoomPlayers(playersInRoom);
    });

    return () => {
      socket.off("connect", rejoin);
      socket.off("updatePlayers");
      socket.off("roomCreated");
      socket.off("roomListUpdated");
      socket.off("matchPlayers");
      socket.off("roomJoined");
    };
  }, [
    registered,
    token,
    name,
    balance,
    setBalance,
    setMyRoom,
    setRoomPlayers,
    setAvailableRooms,
  ]);

  const handleSignOut = () => {
    socket.emit("signOut", token); // Notify server to remove player
    signOut(); // Zustand cleanup
    clearRoom();
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

  const handleJoin = () => {
    socket.emit("joinRoom", {
      roomId: roomId,
      name,
      balance,
    });
    setRoomId(null);
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
          <p className="text-lg mb-6">
            Your balance:{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 inline-block text-transparent bg-clip-text font-semibold">
              ${balance}
            </span>
          </p>

          <p>Players Connected:</p>
          <ul className="mb-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 inline-block text-transparent bg-clip-text">
            {players.map((player, index) => (
              <li key={index}>{player.name}</li>
            ))}
          </ul>

          {availableRooms.length > 0 && (
            <>
              <p>Available Rooms:</p>
              <ul>
                {availableRooms.map((room, index) => (
                  <li key={index}>
                    Room: {room.roomId} — Host: {room.host.name}
                    <br />
                    {/* Solo mostrar el botón si el jugador NO es el host y si ya hay 2 jugadores, no motrarlo */}
                    {room.host.name !== name &&
                      !room.players.some((p) => p.name === name) && (
                        <button onClick={handleJoin}>Join</button>
                      )}
                  </li>
                ))}
              </ul>
            </>
          )}

          <br />

          {roomId && (
            <>
              <p>Players in Room:</p>
              <p>Room ID: {roomId}</p>
              <ul>
                {roomPlayers.map((p, index) => (
                  <li key={index}>
                    {p.name} — ${p.balance}
                  </li>
                ))}
              </ul>
            </>
          )}

          <br />

          <button onClick={handleCreateRoom}>Create Room</button>

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
