import axios from "axios";
import { ILocalesCache, IHandbookCache, ICache, CacheKeys, CacheValues, ILocaleCache } from "@src/interfaces/ICaches";
import { IGiteaContentsResponse } from "@src/interfaces/IGiteaContentsResponse";
import { IGiteaItem } from "@src/interfaces/IGiteaItem";
import { IGiteaLocale } from "@src/interfaces/IGiteaLocale";
import { IGiteaHandbook } from "@src/interfaces/IGiteaHandbook";
import { promisify } from "util";

export class CacheService {
    private static cache: Map<CacheKeys, CacheValues> = new Map();

    private static async refreshItemsCache(): Promise<void> {
        const items = (await axios.get<Record<string, IGiteaItem>>(Bun.env.GITEA_ITEMS_URL)).data;
        const customization = (await axios.get<Record<string, IGiteaItem>>(Bun.env.GITEA_CUSTOMIZATION_URL)).data;

        this.setCache("items", {
            ...items,
            ...customization
        });
    }

    private static async refreshLocalesCache(): Promise<void> {
        let locales: ILocalesCache = {};

        const localesList = (await axios.get<IGiteaContentsResponse[]>(Bun.env.GITEA_LOCALES_API_URL)).data;

        for (const locale of localesList) {
            const localeName = locale.name.split(".json")[0].trim();
            if (localeName.length === 0) {
                continue;
            }

            const localeJson = (await axios.get<IGiteaLocale>(locale.download_url)).data;

            const templates: ILocaleCache = {};

            for (const item of Object.values(this.getCache("items"))) {
                if (item._type === "Node" || localeJson[`${item._id} Name`] === undefined) {
                    continue;
                }

                templates[item._id] = {
                    "Name": localeJson[`${item._id} Name`],
                    "ShortName": localeJson[`${item._id} ShortName`],
                    "Description": localeJson[`${item._id} Description`]
                };
            }

            locales[localeName] = templates;
        }

        this.setCache("locales", locales);
    }

    private static async refreshHandbookCache(): Promise<void> {
        let handbook: IHandbookCache = {};
        const gitea_handbook = (await axios.get<{ Items: IGiteaHandbook[] }>(Bun.env.GITEA_HANDBOOK_URL)).data;

        for (const handbookItem of gitea_handbook.Items) {
            handbook[handbookItem.Id] = {
                ParentId: handbookItem.ParentId,
                Price: handbookItem.Price
            };
        }

        this.setCache("handbook", handbook);
    }

    public static async refreshAllCache(): Promise<void> {
        console.log("[CACHE] Refreshing cache...");
        await this.refreshItemsCache();
        await this.refreshLocalesCache();
        await this.refreshHandbookCache();
        console.log("[CACHE] Cache refreshed.");
    }

    public static getCache<T extends CacheKeys>(key: T): ICache[T] {
        return this.cache.get(key) as ICache[T];
    }

    private static setCache<T extends CacheKeys>(key: T, value: ICache[T]): void {
        this.cache.set(key, value);
    }
}
