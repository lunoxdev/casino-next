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

        fetchProfile: async () => {
          console.log("📡 fetchProfile called");

          try {
            const { token } = useAuthStore.getState(); // ✅ Get the token from the auth store
            console.log("🔐 Retrieved token:", token);
            if (!token) throw new Error("Token missing");

            const res = await axios.get("/api/profile", {
              headers: {
                Authorization: `Bearer ${token}`, // ✅ Add the token to the headers
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
      }
    )
  )
);
