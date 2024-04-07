import { ItemData } from "@src/dto/ItemData";
import { ItemHandbook } from "@src/dto/ItemHandbook";
import { ItemLocale } from "@src/dto/ItemLocale";

export interface ItemComplete {
  item: ItemData;
  locale: ItemLocale;
  handbook: ItemHandbook;
}
