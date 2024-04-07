import { create } from "zustand";
import { persist } from "zustand/middleware";

interface IStore {
  preferedLocale: string;
}

interface IMutations {
  setPreferedLocale(newLocale: string): void;
}

export const useLocaleStore = create<IStore & IMutations>()(
  persist(
    (set) => ({
      preferedLocale: "en",

      setPreferedLocale(newLocale: string) {
        set({ preferedLocale: newLocale })
      },
    }), {
      name: "locale"
    }
  )
);
