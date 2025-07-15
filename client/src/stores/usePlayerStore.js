import { create } from "zustand";

export const usePlayerStore = create((set) => ({
  name: "",
  balance: 0,
  setName: (name) => set({ name }),
  setBalance: (newBalance) => set({ balance: newBalance }),
}));
