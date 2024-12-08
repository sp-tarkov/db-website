import { Elysia, t } from "elysia";

import { item } from "@src/routes/api/item";
import { CacheService } from "@src/services/CacheService";
import { CacheController } from "@src/controllers/cacheController";

export const api = new Elysia({ prefix: "/api" })
    .use(item)
    .get("/locales", async () => {
        return await CacheController.getLocales();
    })
    .get("/refresh", async () => {
        return await CacheController.refreshAllCache();
    })
    .post("/search", async ({ body }) => {
        return CacheController.searchItem(body["query"], body["locale"]);
    }, {
        body: t.Object({
            query: t.String(),
            locale: t.Optional(t.String()),
        })
    })
    .get("/cache/:key", async ({ params: { key } }) => {
        return CacheService.getCache(key);
    }, {
        params: t.Object({
            key: t.Union([ t.Literal("items"), t.Literal("locales"), t.Literal("handbook") ]),
        })
    });
