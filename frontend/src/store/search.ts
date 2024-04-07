import { create } from "zustand";

interface IStore {
  searchInput: string;
  desiredSearchInput: string;
}

interface IMutations {
  setSearchInput(newInput: string): void;
  setDesiredSearchInput(newInput: string): void;
}

export const useSearchStore = create<IStore & IMutations>()(
  (set) => ({
    searchInput: "",
    desiredSearchInput: "",

    setSearchInput(newInput: string) {
      set({ searchInput: newInput });
    },
    setDesiredSearchInput(newInput: string) {
      set({ desiredSearchInput: newInput });
    }
  })
);
