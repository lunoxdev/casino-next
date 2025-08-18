import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type Player, type Room } from "../types/room";

export interface RoomState {
  myRoom: {
    roomId: string | null;
    gameName: string | null;
    roomPlayers: Player[];
  };
  availableRooms: Room[];

  // Setters
  setMyRoom: (roomId: string, gameName: string, roomPlayers: Player[]) => void;
  setRoomId: (roomId: string) => void;
  setRoomPlayers: (roomPlayers: Player[]) => void;
  setAvailableRooms: (rooms: Room[]) => void;

  // Reset
  clearRoom: () => void;
}

const initialRoomsState = {
  myRoom: {
    roomId: null,
    gameName: null,
    roomPlayers: [],
  },
  availableRooms: [],
};

export const useRoomsStore = create<RoomState>()(
  devtools(
    persist(
      (set) => ({
        ...initialRoomsState,

        setMyRoom: (roomId, gameName, roomPlayers) =>
          set({ myRoom: { roomId, gameName, roomPlayers } }),

        setRoomId: (roomId) =>
          set((state) => ({
            myRoom: { ...state.myRoom, roomId },
          })),

        setRoomPlayers: (roomPlayers) =>
          set((state) => ({
            myRoom: { ...state.myRoom, roomPlayers },
          })),

        setAvailableRooms: (rooms) => set({ availableRooms: rooms }),

        clearRoom: () => {
          set(initialRoomsState, false, "clearRoom");
          localStorage.removeItem("__rooms");
        },
      }),
      {
        name: "__rooms",
      }
    )
  )
);
