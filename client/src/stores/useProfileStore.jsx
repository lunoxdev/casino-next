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
            set({ nickname, balance, uuid });
          } catch (err) {
            console.error("❌ Error fetching profile:", err);
            set({ nickname: "", balance: 0 });
          }
        },

        clearProfile: () => {
          set({ nickname: "", balance: 0 });
          localStorage.removeItem("__profile");
        },
      }),
      {
        name: "__profile",
        partialize: (state) => ({
          nickname: state.nickname,
          balance: state.balance,
          uuid: state.uuid,
        }),
      }
    )
  )
);
