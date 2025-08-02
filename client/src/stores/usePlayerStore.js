import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";

export const usePlayerStore = create(
  devtools(
    persist(
      (set) => ({
        name: "",
        balance: 0,
        token: "",
        registered: false,

        setBalance: (newBalance) => set({ balance: newBalance }),

        register: async (name) => {
          try {
            const res = await axios.post("/api/player/register", { name });
            const { name: playerName, balance, token } = res.data;

            set({
              name: playerName,
              balance,
              token,
              registered: true,
            });
          } catch (err) {
            if (err.response && err.response.status === 409) {
              throw new Error("⚠️ Name already taken");
            }
            throw new Error("❌ Registration failed. Try again.");
          }
        },

        logOut: () => {
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
