import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "../api/api";
import { useAuthStore } from "./useAuthStore";

export const useProfileStore = create(
  devtools(
    persist(
      (set, get) => ({
        nickname: "",
        balance: 0,
        isRehydrated: false,

        fetchProfile: async () => {
          console.log("📡 fetchProfile called");

          try {
            const { token } = useAuthStore.getState();
            console.log("🔐 Retrieved token:", token);
            if (!token) throw new Error("Token missing");

            const res = await axios.get("/api/profile", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const { nickname, balance } = res.data;
            console.log("✅ API response:", res.data);

            set({ nickname, balance });
            console.log("🧠 Zustand store updated:", get());
          } catch (err) {
            console.error("❌ Error fetching profile:", err);
            set({ nickname: "", balance: 0 });
            console.log("🧠 Zustand store reset:", get());
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
        onRehydrateStorage: () => (state) => {
          console.log("✅ Zustand profile store rehydrated");
          state.isRehydrated = true;
        },
      }
    )
  )
);
