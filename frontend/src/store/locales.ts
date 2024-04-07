import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getLocaleList } from "@src/api/locales";

interface IStore {
  localesList: string[];
}

interface IMutations {
  refreshLocalesList(): void;
}

export const useLocalesListStore = create<IStore & IMutations>()(
  persist(
    (set, get) => ({
      localesList: [],

      async refreshLocalesList() {
        if(get().localesList.length > 0) return;

        const locales = await getLocaleList();
        set({ localesList: locales });
      }
    }), {
      name: "locales",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
