import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ItemHierarchy } from "@src/dto/ItemHierarchy";
import { ItemComplete } from "@src/dto/ItemComplete";

interface IStore {
  itemsHierarchy: ItemHierarchy;
}

interface IMutations {
  setHierarchy(newHierarchy: ItemHierarchy): void;
  getCachedHierarchy(itemID: string): ItemHierarchy | undefined;
}

export const useHierarchyStore = create<IStore & IMutations>()(
  persist(
    (set, get) => ({
      itemsHierarchy: {},

      setHierarchy(newHierarchy: ItemHierarchy) {
        set({ itemsHierarchy: {...get().itemsHierarchy, ...newHierarchy} });
      },
      getCachedHierarchy(itemID: string): ItemHierarchy | undefined {
        const hierarchy: ItemHierarchy = {};
        let currItemID: string | undefined = itemID;
        let gotAllHierarchy = true;

        while(currItemID) {
          if(get().itemsHierarchy[currItemID] === undefined) {
            gotAllHierarchy = false;
            break;
          }

          const item = get().itemsHierarchy[currItemID] as ItemComplete;
          hierarchy[currItemID] = item;
          currItemID = item.item._parent;
        }

        if(!gotAllHierarchy) return;

        return hierarchy;
      },
    }), {
      name: "hierarchy",
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
