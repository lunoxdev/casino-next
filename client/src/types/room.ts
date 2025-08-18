export interface Player {
  uuid: string;
  nickname: string;
  balance: number;
}

export interface Room {
  roomId: string;
  gameName: string | null;
  players: Player[];
  host: Player;
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
