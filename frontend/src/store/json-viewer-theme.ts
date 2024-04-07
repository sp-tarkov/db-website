import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ThemeKeys } from "@microlink/react-json-view";

interface IStore {
  themeMode: ThemeKeys;
}

interface IMutations {
  setThemeMode(newTheme: ThemeKeys): void;
}

export const useJsonViewerThemeStore = create<IStore & IMutations>()(
  persist(
    (set) => ({
      themeMode: "apathy",

      setThemeMode(newTheme: ThemeKeys) {
        set({ themeMode: newTheme })
      }
    }), {
      name: "json-viewer-theme"
    }
  )
);
