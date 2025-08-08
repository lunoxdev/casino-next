// Store for managing player data in the server
// This file is used to keep track of players and their balances
export const players = new Map();

export const addPlayer = (uuid, playerData) => {
  players.set(uuid, playerData);
};

export const removePlayer = (uuid) => {
  players.delete(uuid);
};

export const getPlayersList = () => {
  return Array.from(players.values());
};
