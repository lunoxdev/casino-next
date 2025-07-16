// Store for managing player data in the server
// This file is used to keep track of players and their balances
// Change this to save player data in a database like MySQL
export const players = new Map();

export const addPlayer = (id, playerData) => {
  players.set(id, playerData);
};

export const removePlayer = (id) => {
  players.delete(id);
};

export const getPlayersList = () => {
  return Array.from(players.values());
};
