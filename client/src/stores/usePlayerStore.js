import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const usePlayerStore = create(
  devtools((set) => ({
    name: "",
    balance: 0,
    setName: (name) => set({ name }),
    setBalance: (newBalance) => set({ balance: newBalance }),
  }))
);
