import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";
export type ThemeColor = "emerald" | "orange";

interface ThemeState {
  theme: Theme;
  primaryColor: ThemeColor;
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: ThemeColor) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      primaryColor: "emerald",
      setTheme: (theme) => set({ theme }),
      setPrimaryColor: (color) => set({ primaryColor: color }),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "theme-storage",
    }
  )
);
