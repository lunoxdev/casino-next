import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";

export const usePlayerStore = create(
  devtools(
    persist(
      (set, get) => ({
        name: "",
        balance: 0,
        token: "",
        refreshToken: "",
        registered: false,

        setBalance: (newBalance) => set({ balance: newBalance }),

        register: async (name) => {
          try {
            const res = await axios.post("/api/player/register", { name });
            const { name: playerName, balance, token, refreshToken } = res.data;

            set({
              name: playerName,
              balance,
              token,
              refreshToken,
              registered: true,
            });
          } catch (err) {
            if (err.response && err.response.status === 409) {
              throw new Error("⚠️ Name already taken");
            }
            throw new Error("❌ Registration failed. Try again.");
          }
        },

        refreshAccessToken: async () => {
          try {
            const currentRefreshToken = get().refreshToken;
            if (!currentRefreshToken) return;

            const res = await axios.post("/api/player/refresh", {
              refreshToken: currentRefreshToken,
            });
            const { token: newToken, refreshToken: newRefreshToken } = res.data;

            // Update state
            set((state) => ({
              ...state,
              token: newToken,
              refreshToken: newRefreshToken,
            }));

            // Save updated token to local storage
            const playerData = JSON.parse(
              localStorage.getItem("player-storage")
            );
            playerData.state.token = newToken;
            playerData.state.refreshToken = newRefreshToken;
            localStorage.setItem("player-storage", JSON.stringify(playerData));
          } catch (err) {
            console.error("Error renewing token:", err);

            set({
              name: "",
              balance: 0,
              registered: false,
              token: "",
              refreshToken: "",
            });
          }
        },

        logOut: () => {
          set({
            name: "",
            balance: 0,
            registered: false,
            token: "",
            refreshToken: "",
          });
        },
      }),
      {
        name: "player-storage",
      }
    )
  )
);
