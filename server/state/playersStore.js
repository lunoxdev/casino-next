// Store for managing player data in the server
// This file is used to keep track of players and their balances
export const players = new Map();

export const addPlayer = (token, playerData) => {
  players.set(token, playerData);
};

export const removePlayer = (token) => {
  players.delete(token);
};

export const getPlayersList = () => {
  return Array.from(players.values());
};
