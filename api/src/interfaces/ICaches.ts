import { IGiteaHandbook } from "@src/interfaces/IGiteaHandbook";
import { IGiteaItem } from "@src/interfaces/IGiteaItem";

export type IItemCache = Record<string, IGiteaItem>;

export interface ILocale {
    "Name": string,
    "ShortName": string,
    "Description": string
}

export type ILocaleCache = Record<string, ILocale>;

export type ILocalesCache = Record<string, ILocaleCache>;

export type IHandbookCache = Record<string, Omit<IGiteaHandbook, "Id">>;

export interface ICache {
    items: IItemCache;
    locales: ILocalesCache;
    handbook: IHandbookCache;
}

export type CacheKeys = keyof ICache;

export type CacheValues = ICache[CacheKeys];
