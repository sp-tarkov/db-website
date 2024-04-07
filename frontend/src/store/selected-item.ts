import { create } from "zustand";
import { ItemComplete } from "@src/dto/ItemComplete";

interface IStore {
  selectedItem?: ItemComplete;
}

interface IMutations {
  setSelectedItem(newSelectedItem?: ItemComplete): void;
}

export const useSelectedItemStore = create<IStore & IMutations>()(
  (set) => ({
    selectedItem: undefined,

    setSelectedItem(newSelectedItem?: ItemComplete) {
      set({ selectedItem: newSelectedItem });
    },
  })
);
