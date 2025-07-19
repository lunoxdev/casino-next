import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useRoomsStore = create(
  devtools(
    persist((set) => ({
      myRoom: {
        roomId: null,
        gameName: null,
        roomPlayers: [],
      },
      availableRooms: [],

      // Setters
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

      // Reset
      clearRoom: () =>
        set({ myRoom: { roomId: null, gameName: null, roomPlayers: [] } }),
      clearAvailableRooms: () => set({ availableRooms: [] }),
    }))
  )
);
