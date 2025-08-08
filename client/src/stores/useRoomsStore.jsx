import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const initialRoomsState = {
  myRoom: {
    roomId: null,
    gameName: null,
    roomPlayers: [],
  },

  availableRooms: [],
};

export const useRoomsStore = create(
  devtools(
    persist(
      (set) => ({
        ...initialRoomsState,

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
        clearRoom: () => set(initialRoomsState, false, "clearRoom"),
      }),
      {
        name: "__rooms",
      }
    )
  )
);
