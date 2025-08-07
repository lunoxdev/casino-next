import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";
import { useAuthStore } from "./useAuthStore";

export const useProfileStore = create(
  devtools(
    persist(
      (set) => ({
        nickname: "",
        balance: 0,

        setProfile: ({ nickname, balance }) => set({ nickname, balance }),

        fetchProfile: async () => {
          try {
            const { token } = useAuthStore.getState(); // ✅ Get the token from the auth store
            if (!token) throw new Error("Token missing");

            const res = await axios.get("/api/profile", {
              headers: {
                Authorization: `Bearer ${token}`, // ✅ Add the token to the headers
              },
            });

            const { nickname, balance } = res.data;
            set({ nickname, balance });
          } catch (err) {
            console.error("❌ Error fetching profile:", err);
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
