import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useAuthStore } from "./useAuthStore";
import axios from "../api/api";
import { type ProfileState } from "./../types/profile";

const initialProfileState = {
  nickname: "",
  balance: 0,
  uuid: "",
};

export const useProfileStore = create<ProfileState>()(
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
            set({ nickname, balance, uuid }, false, "fetchProfile");
          } catch (err) {
            console.error("❌ Error fetching profile:", err);
            set({ nickname: "", balance: 0 });
          }
        },

        clearProfile: () => {
          set(initialProfileState, false, "clearProfile");
          localStorage.removeItem("__profile");
        },
      }),
      {
        name: "__profile",
      }
    )
  )
);
