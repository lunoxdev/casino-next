import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import axios from "../api/api";

const initialProfileState = {
  nickname: "",
  balance: 0,
  uuid: "",
};

export const useProfileStore = create(
  devtools(
    persist(
      (set) => ({
        ...initialProfileState,

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
          set(initialProfileState);
          localStorage.removeItem("__profile");
        },
      }),
      {
        name: "__profile",
      }
    ),
    { name: "ProfileStore" }
  )
);
