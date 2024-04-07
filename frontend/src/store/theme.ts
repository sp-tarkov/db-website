import { create } from "zustand";
import { persist } from "zustand/middleware";

type ThemeMode = "dark" | "light";

interface IStore {
  checkedPreferredColorScheme: boolean;
  themeMode: ThemeMode;
}

interface IMutations {
  setCheckedPreferredColorScheme(): void;
  toggleTheme(): void;
  setThemeMode(newTheme: ThemeMode): void;
}

export const useThemeStore = create<IStore & IMutations>()(
  persist(
    (set, get) => ({
      checkedPreferredColorScheme: false,
      themeMode: "dark",

      setCheckedPreferredColorScheme() {
        set({ checkedPreferredColorScheme: true })
      },
      toggleTheme() {
        set({ themeMode: get().themeMode === "dark" ? "light" : "dark" })
      },
      setThemeMode(newTheme: ThemeMode) {
        set({ themeMode: newTheme })
      }
    }), {
      name: "theme"
    }
  )
);
