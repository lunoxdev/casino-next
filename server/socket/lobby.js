import {
  addPlayer,
  removePlayer,
  getPlayersList,
} from "../state/playersStore.js";
import {
  createRoom,
  getRoomPlayers,
  getAllRooms,
  matchRooms,
} from "../state/matchRooms.js";

export default function lobbySockets(socket, io) {
  socket.on("playerJoined", (playerData) => {
    // ⚠️ Change this when Auth is implemented
    const { token } = playerData;
    if (!token) return;

    const alreadyConnected = getPlayersList().some((p) => p.token === token);
    if (!alreadyConnected) {
      addPlayer(token, playerData);
      console.log(`🟢 Player ${playerData.name} has joined`);
    }

    io.emit("updatePlayers", getPlayersList()); // ⬅️ broadcast for all players in lobby
    io.emit("roomListUpdated", getAllRooms()); // ⬅️ broadcast for all players in lobby
  });

  socket.on("logOut", ({ token, name }) => {
    if (!token || !name) return;

    // 🔁 Search the player in the rooms
    const roomEntry = Array.from(matchRooms.entries()).find(([_, room]) =>
      room.players.some((p) => p.token === token || p.name === name)
    );

    if (roomEntry) {
      const [roomId, room] = roomEntry;
      room.players = room.players.filter(
        (p) => p.token !== token && p.name !== name
      );

      if (room.players.length === 0) {
        matchRooms.delete(roomId);
      } else {
        matchRooms.set(roomId, room);
      }

      socket.leave(roomId);
      io.to(roomId).emit("matchPlayers", room.players);
    }

    removePlayer(token);

    io.emit("updatePlayers", getPlayersList()); // ⬅️ broadcast for all players in lobby
    io.emit("roomListUpdated", getAllRooms()); // ⬅️ broadcast for all players in lobby

    console.log(`🔴 Player ${name} has logged out`);
  });

  socket.on("createRoom", ({ roomId, name, balance }) => {
    const player = { name, balance };
    createRoom(roomId, player);

    const room = matchRooms.get(roomId);

    socket.join(roomId);
    socket.emit("roomCreated", {
      roomId,
      player,
      gameName: room.gameName,
    });

    io.to(roomId).emit("matchPlayers", getRoomPlayers(roomId)); // ⬅️ broadcast for players in room
    io.emit("roomListUpdated", getAllRooms()); // ⬅️ broadcast for all players in lobby
  });

  socket.on("getRooms", () => {
    socket.emit("roomListUpdated", getAllRooms()); // ⬅️ broadcast for all players in lobby
  });

  socket.on("joinRoom", ({ roomId, name, balance }) => {
    const room = matchRooms.get(roomId);
    if (!room || room.players.length >= 2) return;

    const newPlayer = { name, balance };
    room.players.push(newPlayer);
    matchRooms.set(roomId, room);

    socket.join(roomId);

    io.to(roomId).emit("matchPlayers", room.players); // ⬅️ broadcast for players in room
    io.emit("roomListUpdated", getAllRooms()); // ⬅️ broadcast for all players in lobby
  });

  socket.on("leaveRoom", ({ roomId, name }) => {
    const room = matchRooms.get(roomId);
    if (!room) return;

    room.players = room.players.filter((p) => p.name !== name);

    if (room.players.length === 0) {
      matchRooms.delete(roomId);
    } else {
      matchRooms.set(roomId, room);
    }

    socket.leave(roomId);

    io.to(roomId).emit("matchPlayers", room.players); // ⬅️ broadcast for players in room
    io.emit("roomListUpdated", getAllRooms()); // ⬅️ broadcast for all players in lobby
  });
}
