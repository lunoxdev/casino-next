export const playersList = new Map();

export const addPlayer = (uuid, playerData) => {
  playersList.set(uuid, playerData);
};

export const removePlayer = (uuid) => {
  playersList.delete(uuid);
};

export const getPlayersList = () => {
  return Array.from(playersList.values());
};
