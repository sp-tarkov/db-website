import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { staticPlugin } from "@elysiajs/static";
import { Logestic } from "logestic";
import { CacheService } from "@src/services/CacheService";
import { api } from "@src/routes/api";

await CacheService.refreshAllCache();

new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: "SPT-AKI DB API",
                version: "1.0.0",
            }
        }
    }))
    .use(cors({ allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept" }))
    .use(staticPlugin({ prefix: "/", indexHTML: true }))
    .use(Logestic.preset("fancy"))
    .use(api)
    .get("/search", () => Bun.file("public/index.html"))
    .get("/search/*", () => Bun.file("public/index.html"))
    .listen(3000, (server) => {
        console.log(`Server is running at ${server.hostname}:${server.port}`);
    });
