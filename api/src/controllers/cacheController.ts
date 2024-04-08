import { error } from "elysia";

import { CacheService } from "@src/services/CacheService";

export class CacheController {
    public static async getLocales() {
        return Object.keys(CacheService.getCache("locales"));
    }

    public static async refreshAllCache(): Promise<void> {
        await CacheService.refreshAllCache();
    }

    public static async searchItem(query: string, localeId: string = "en") {
        const items = CacheService.getCache("items");
        const locales = CacheService.getCache("locales");

        const searchInput = query.toLowerCase().trim();
        const locale = locales[localeId];

        return {
            items: Object.values(items).filter((item) => {
                return (item._id.toLowerCase().includes(searchInput)
                  || item._name.toLowerCase().includes(searchInput)
                  || item._parent.toLowerCase().includes(searchInput)
                  || (locale[item._id] && (locale[item._id]["Name"].toLowerCase().includes(searchInput) || locale[item._id]["ShortName"].toLowerCase().includes(searchInput))));
            }).map((item) => {
                return {
                    item: {
                        _id: item._id,
                        _name: item._name,
                    },
                    locale: locale[item._id] ?? {}
                }
            })
        };
    }

    public static async getItem(id: string, localeId: string = "en") {
        const items = CacheService.getCache("items");
        const locales = CacheService.getCache("locales");
        const handbook = CacheService.getCache("handbook");

        if (!items[id]) {
            return error(404, "Item not found");
        }

        const item = items[id];
        const locale = locales[localeId];

        return {
            item: item,
            locale: locale[item._id] ?? {},
            handbook: handbook[item._id] ?? {}
        };
    }

    public static async getItemNameById(id: string, localeId: string = "en") {
        const items = CacheService.getCache("items");
        const locales = CacheService.getCache("locales");

        if (!items[id]) {
            return error(404, "Item not found");
        }

        const item = items[id];
        const locale = locales[localeId];

        if (!locale[item._id]) {
            return;
        }

        return {
            locale: {
                "Name": locale[item._id]["Name"],
                "ShortName": locale[item._id]["ShortName"]
            }
        };
    }

    public static async getItemNames(localeId: string = "en") {
        const items = CacheService.getCache("items");
        const locales = CacheService.getCache("locales");
        const handbook = CacheService.getCache("handbook");

        const locale = locales[localeId];

        return Object.values(items).filter((item) => locale[item._id]).map((item) => {
            return {
                item: {
                    _id: item._id
                },
                locale: {
                    "Name": locales[localeId][item._id]["Name"],
                    "ShortName": locales[localeId][item._id]["ShortName"]
                },
                handbook: handbook[item._id] ?? {}
            }
        });
    }

    public static async getItemHierarchy(id: string, localeId: string = "en") {
        const items = CacheService.getCache("items");
        const locales = CacheService.getCache("locales");

        if (!items[id]) {
            return;
        }

        const item = items[id];
        const locale = locales[localeId];

        let currItem = {
            item: {
                _id: item._id,
                _name: item._name,
                _parent: item._parent
            },
            locale: locale[item._id] ?? {}
        };

        let hierarchy: Record<string, typeof currItem> = {};

        hierarchy[item._id] = currItem;

        while (currItem.item._parent) {
            const currItemData = items[currItem.item._parent];
            currItem = {
                item: {
                    _id: currItemData._id,
                    _name: currItemData._name,
                    _parent: currItemData._parent
                },
                locale: locale[currItemData._id] ?? {}
            };

            hierarchy[currItemData._id] = currItem;
        }

        return hierarchy;
    }
}
