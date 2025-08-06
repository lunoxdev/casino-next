import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";

export const useAuthStore = create(
  devtools(
    persist(
      (set, get) => ({
        nickname: "",
        balance: 0,
        uuid: "",
        token: "",
        registered: false,

        setBalance: (newBalance) => set({ balance: newBalance }),

        register: async (nickname) => {
          try {
            const res = await axios.post("/api/playerAuth/register", {
              nickname,
            });

            const { nickname: playerNickname, balance, uuid, token } = res.data;

            set({
              nickname: playerNickname,
              balance,
              uuid,
              token,
              registered: true,
            });
          } catch (err) {
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

            const res = await axios.post("/api/playerAuth/refresh", {
              refreshToken: currentRefreshToken,
            });
            const { token: newToken, uuid: newUuid } = res.data;
            set({ token: newToken, uuid: newUuid });
          } catch (err) {
            console.error("Error renewing session:", err);

            set({
              nickname: "",
              balance: 0,
              uuid: "",
              token: "",
              registered: false,
            });
          }
        },

        login: async (nickname) => {
          console.log("📨 Attempting to login with nickname:", nickname);
          try {
            const res = await axios.post("/api/playerAuth/login", { nickname });
            const { nickname: playerNickname, balance, uuid, token } = res.data;

            set({
              nickname: playerNickname,
              balance,
              uuid,
              token,
              registered: true,
            });
          } catch (err) {
            if (err.response?.status === 404) {
              throw new Error("⚠️ Nickname not found");
            }

            if (err.response?.data?.error) {
              throw new Error(`❌ ${err.response.data.error}`);
            }

            throw new Error("❌ Login failed. Try again.");
          }
        },

        logOut: () => {
          set({
            nickname: "",
            balance: 0,
            uuid: "",
            token: "",
            registered: false,
          });
          localStorage.removeItem("__ps");
        },
      }),
      {
        name: "__ps",
        partialize: (state) => ({
          uuid: state.uuid,
          token: state.token,
        }),
      }
    )
  )
);
