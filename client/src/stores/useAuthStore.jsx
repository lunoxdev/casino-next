import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";

const initialAuthState = {
  uuid: "",
  token: "",
  loggedIn: false,
};

export const useAuthStore = create(
  devtools(
    persist(
      (set) => ({
        ...initialAuthState,

        login: async (nickname) => {
          try {
            const res = await axios.post("/api/playerAuth/login", { nickname });
            const { uuid, token } = res.data;
            set({ uuid, token, loggedIn: true });
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
            set({ uuid, token, loggedIn: true });
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
            set({ token, uuid, loggedIn: true });
          } catch (err) {
            console.error("Error renewing session:", err);
            set(initialAuthState);
          }
        },

        logOut: () => {
          set(initialAuthState, false, "logOut");
          localStorage.removeItem("__auth");
        },
      }),
      {
        name: "__auth",
      }
    )
  )
);
