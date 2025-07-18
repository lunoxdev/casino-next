export const matchRooms = new Map();

export const createRoom = (roomId, hostPlayer) => {
  matchRooms.set(roomId, {
    roomId,
    host: hostPlayer,
    players: [hostPlayer],
  });
};

export const getRoomPlayers = (roomId) => {
  const room = matchRooms.get(roomId);
  return room ? room.players : [];
};

export const getAllRooms = () => {
  return Array.from(matchRooms.values());
};
