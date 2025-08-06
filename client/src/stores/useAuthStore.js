import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        uuid: "",
        token: "",
        registered: false,

        login: async (nickname) => {
          try {
            const res = await axios.post("/api/playerAuth/login", { nickname });
            const { uuid, token } = res.data;
            set({ uuid, token, registered: true });
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

        register: async (nickname) => {
          try {
            const res = await axios.post("/api/playerAuth/register", {
              nickname,
            });
            const { uuid, token } = res.data;
            set({ uuid, token, registered: true });
          } catch (err) {
            if (err.response?.status === 409) {
              throw new Error("⚠️ Nickname already taken");
            }
            throw new Error("❌ Registration failed. Try again.");
          }
        },

        refreshAccessToken: async () => {
          try {
            const res = await axios.post("/api/playerAuth/refresh");
            const { token, uuid } = res.data;
            set({ token, uuid, registered: true });
          } catch (err) {
            console.error("Error renewing session:", err);
            set({ uuid: "", token: "", registered: false });
          }
        },

        logOut: () => {
          set({ uuid: "", token: "", registered: false });
          localStorage.removeItem("__auth");
        },
      }),
      {
        name: "__auth",
        partialize: (state) => ({
          uuid: state.uuid,
          registered: state.registered,
        }),
      }
    )
  )
);
