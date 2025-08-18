export interface Player {
  nickname: string;
  balance: number;
}

export interface Room {
  roomId: string;
  gameName: string | null;
  players: Player[];
  host: Player;
}

export interface RoomState {
  myRoom: Room;
  availableRooms: Room[];

  setMyRoom: (roomId: string, gameName: string, roomPlayers: Player[]) => void;
  setRoomId: (roomId: string) => void;
  setRoomPlayers: (roomPlayers: Player[]) => void;
  setAvailableRooms: (rooms: Room[]) => void;

  clearRoom: () => void;
}

export interface LobbySocketOptions {
  setPlayers: (players: Player[]) => void;
  enabled?: boolean;
}

export interface GameList {
  handleCreateRoom: (gameName: string) => void;
}

export interface RoomPanel {
  gameName: string;
  roomPlayers: Player[];
  handleStartMatch: () => void;
  handleLeave: () => void;
}

export interface ProfileHeader {
  nickname: string;
  balance: number;
  players: Player[];
  handleLogOut: () => void;
}

export interface AvailableRoomsListProps {
  availableRooms: Room[];
  nickname: string;
  handleJoin: (roomId: string) => void;
}
