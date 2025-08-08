import {
  addPlayer,
  removePlayer,
  getPlayersList,
} from "../../state/playersStore.js";
import {
  createRoom,
  getRoomPlayers,
  getAllRooms,
  matchRooms,
} from "../../state/matchRooms.js";

export default function lobbySockets(socket, io) {
  socket.on("playerJoined", (playerData) => {
    const { uuid, nickname, balance } = playerData;

    if (!uuid || !nickname) return;

    const alreadyConnected = getPlayersList().some(
      (p) => p.uuid === uuid || p.nickname === nickname
    );

    if (!alreadyConnected) {
      addPlayer(uuid, { uuid, nickname, balance });
      console.log(`🟢 Player ${nickname} has joined the lobby`);
    }

    io.emit("updatePlayers", getPlayersList()); // ⬅️ broadcast for all players in lobby
    io.emit("roomListUpdated", getAllRooms()); // ⬅️ broadcast for all players in lobby
  });

  socket.on("logOut", ({ uuid }) => {
    if (!uuid) return;

    removePlayer(uuid);

    const roomEntry = Array.from(matchRooms.entries()).find(([_, room]) =>
      room.players.some((p) => p.uuid === uuid)
    );

    if (roomEntry) {
      const [roomId, room] = roomEntry;

      // Remove player from room
      room.players = room.players.filter((p) => p.uuid !== uuid);

      // Change role if host is leaving
      if (room.host.uuid === uuid) {
        room.host = room.players[0] || null;
      }

      // Delete room if empty
      if (room.players.length === 0) {
        matchRooms.delete(roomId);
      } else {
        matchRooms.set(roomId, room);
      }

      socket.leave(roomId);
      io.to(roomId).emit("matchPlayers", room.players);
    }

    io.emit("updatePlayers", getPlayersList());
    io.emit("roomListUpdated", getAllRooms());
  });

  socket.on("createRoom", ({ roomId, uuid, nickname }) => {
    const player = { uuid, nickname };
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

  socket.on("joinRoom", ({ roomId, uuid, nickname }) => {
    const room = matchRooms.get(roomId);
    if (!room || room.players.length >= 2) return;

    const newPlayer = { uuid, nickname };
    room.players.push(newPlayer);
    matchRooms.set(roomId, room);

    socket.join(roomId);

    socket.emit("joinedRoom", {
      roomId,
      gameName: room.gameName,
      roomPlayers: room.players,
    });

    io.to(roomId).emit("matchPlayers", room.players); // ⬅️ broadcast for players in room
    io.emit("roomListUpdated", getAllRooms()); // ⬅️ broadcast for all players in lobby
  });

  socket.on("leaveRoom", ({ roomId, nickname }) => {
    const room = matchRooms.get(roomId);
    if (!room) return;

    // Delete player from room
    room.players = room.players.filter((p) => p.nickname !== nickname);

    // Change role if host is leaving
    if (room.host.nickname === nickname) {
      room.host = room.players[0] || null;
    }

    // Delete room if empty
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
