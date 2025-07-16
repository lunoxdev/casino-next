import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const usePlayerStore = create(
  devtools(
    persist(
      (set) => ({
        name: "",
        balance: 0,
        registered: false,
        token: "", // <-- Temporary token for the session

        register: (name) => {
          const fakeToken = Math.random().toString(36).substring(2);
          set({
            name,
            balance: 1000,
            registered: true,
            token: fakeToken,
          });
        },

        signOut: () => {
          set({
            name: "",
            balance: 0,
            registered: false,
            token: "",
          });
        },
      }),
      {
        name: "player-storage", // name of the item in the storage (must be unique)
      }
    )
  )
);
