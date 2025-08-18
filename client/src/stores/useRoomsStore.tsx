import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { type RoomState } from "./../types/room";

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
