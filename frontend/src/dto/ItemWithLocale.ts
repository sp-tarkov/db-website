import { ItemData } from './ItemData';
import { ItemLocale } from './ItemLocale';

export interface ItemWithLocale {
    item: ItemData
    locale: ItemLocale
}