import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useRoomsStore = create(
  devtools(
    persist((set) => ({
      myRoom: {
        roomId: null,
        roomPlayers: [],
      },
      availableRooms: [],

      // Setters
      setMyRoom: (roomId, roomPlayers) =>
        set({ myRoom: { roomId, roomPlayers } }),

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
      clearRoom: () => set({ myRoom: { roomId: null, roomPlayers: [] } }),
      clearAvailableRooms: () => set({ availableRooms: [] }),
    }))
  )
);
