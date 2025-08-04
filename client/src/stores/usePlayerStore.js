import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";

export const usePlayerStore = create(
  devtools(
    persist(
      (set, get) => ({
        nickname: "",
        balance: 0,
        token: "",
        refreshToken: "",
        registered: false,

        setBalance: (newBalance) => set({ balance: newBalance }),

        register: async (nickname) => {
          console.log("📨 Attempting to register nickname:", nickname);
          try {
            const res = await axios.post("/api/player/register", { nickname });
            console.log("✅ Registration response:", res.data);

            const {
              nickname: playerNickname,
              balance,
              token,
              refreshToken,
            } = res.data;

            set({
              nickname: playerNickname,
              balance,
              token,
              refreshToken,
              registered: true,
            });
          } catch (err) {
            console.error("❌ Registration error:", err);

            if (err.response && err.response.status === 409) {
              throw new Error("⚠️ Nickname already taken");
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

            set({
              token: newToken,
              refreshToken: newRefreshToken,
            });
          } catch (err) {
            console.error("Error renewing token:", err);

            set({
              nickname: "",
              balance: 0,
              token: "",
              refreshToken: "",
              registered: false,
            });
          }
        },

        login: async (nickname) => {
          console.log("📨 Attempting to login with nickname:", nickname);
          try {
            const res = await axios.post("/api/player/login", { nickname });
            console.log("✅ Login response:", res.data);

            const {
              nickname: playerNickname,
              balance,
              token,
              refreshToken,
            } = res.data;

            set({
              nickname: playerNickname,
              balance,
              token,
              refreshToken,
              registered: true,
            });
          } catch (err) {
            console.error("❌ Login error:", err);

            if (err.response?.status === 404) {
              throw new Error("⚠️ Nickname not found");
            }
            throw new Error("❌ Login failed. Try again.");
          }
        },

        logOut: () => {
          set({
            nickname: "",
            balance: 0,
            token: "",
            refreshToken: "",
            registered: false,
          });
        },
      }),
      {
        name: "player-storage",
      }
    )
  )
);
