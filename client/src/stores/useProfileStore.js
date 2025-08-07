import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";

export const useProfileStore = create(
  devtools(
    persist(
      (set) => ({
        nickname: "",
        balance: 0,

        setProfile: ({ nickname, balance }) => set({ nickname, balance }),

        fetchProfile: async (uuid, token) => {
          try {
            // El token aquí puede enviarse en headers para autorizar la petición
            const res = await axios.get("/api/profile", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const { nickname, balance } = res.data;
            set({ nickname, balance });
          } catch (err) {
            console.error("Error fetching profile:", err);
            set({ nickname: "", balance: 0 });
          }
        },

        clearProfile: () => set({ nickname: "", balance: 0 }),
      }),
      {
        name: "__profile",
        partialize: (state) => ({
          nickname: state.nickname,
          balance: state.balance,
        }),
      }
    )
  )
);
