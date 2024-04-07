import { Elysia, t } from "elysia";

import { CacheController } from "@src/controllers/cacheController";

export const item = new Elysia({ prefix: "/item" })
    .get("/", async ({ query }) => {
        return await CacheController.getItem(query["id"], query["locale"]);
    }, {
        query: t.Object({
            id: t.String(),
            locale: t.Optional(t.String())
        })
    })
    .get("/nameByID", async ({ query }) => {
        return await CacheController.getItemNameById(query["id"], query["locale"]);
    }, {
        query: t.Object({
            id: t.String(),
            locale: t.Optional(t.String())
        })
    })
    .get("/names", async ({ query }) => {
        return await CacheController.getItemNames(query["locale"]);
    }, {
        query: t.Object({
            locale: t.Optional(t.String())
        })
    })
    .get("/hierarchy", async ({ query }) => {
        return await CacheController.getItemHierarchy(query["id"], query["locale"]);
    }, {
        query: t.Object({
            id: t.String(),
            locale: t.Optional(t.String())
        })
    });
