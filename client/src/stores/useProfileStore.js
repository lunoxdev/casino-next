// stores/useProfileStore.js
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";

export const useProfileStore = create(
  devtools(
    persist(
      (set) => ({
        nickname: "",
        balance: 0,

        // Set profile manually
        setProfile: ({ nickname, balance }) => set({ nickname, balance }),

        // Fetch profile from server (using uuid from useAuthStore)
        fetchProfile: async (uuid) => {
          try {
            const res = await axios.get("/api/profile", {
              params: { uuid },
              withCredentials: true,
            });

            const { nickname, balance } = res.data;
            set({ nickname, balance });
          } catch (err) {
            console.error("❌ Error fetching profile:", err);
            set({ nickname: "", balance: 0 });
          }
        },

        // Clear profile on logout
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
