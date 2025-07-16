import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const usePlayerStore = create(
  devtools(
    persist(
      (set) => ({
        name: "",
        balance: 0,
        registered: false,
        setName: (name) => set({ name }),
        setBalance: (newBalance) => set({ balance: newBalance }),
        setRegistered: (registered) => set({ registered }),
        reset: () => set({ name: "", balance: 0, registered: false }),
      }),
      {
        name: "player-storage", // name of the item in the storage (must be unique)
      }
    )
  )
);
