import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import axios from "../api/api";

export const useProfileStore = create(
  devtools(
    persist(
      (set) => ({
        nickname: "",
        balance: 0,
        uuid: "",

        fetchProfile: async () => {
          try {
            const { token, uuid } = useAuthStore.getState();
            if (!token) throw new Error("Token missing");

            const res = await axios.get("/api/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const { nickname, balance } = res.data;
            set({ nickname, balance, uuid }, false, "fetchProfile");
          } catch (err) {
            console.error("❌ Error fetching profile:", err);
            set({ nickname: "", balance: 0 });
          }
        },

        clearProfile: () => {
          set({ nickname: "", balance: 0, uuid: "" }, false, "clearProfile");
          localStorage.removeItem("__profile");
        },
      }),
      {
        name: "__profile",
      }
    )
  )
);
