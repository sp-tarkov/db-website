import { ILocalesCache, IHandbookCache, ICache, CacheKeys, CacheValues, ILocaleCache } from "@src/interfaces/ICaches";
import simpleGit, { SimpleGit } from "simple-git";
import fs from "fs/promises";
import path from "path";

export class CacheService {
    private static cache: Map<CacheKeys, CacheValues> = new Map();
    private static repoPath = path.resolve("cache-repo");

    // Pull or clone the repository
    private static async pullRepository(): Promise<void> {
        const git: SimpleGit = simpleGit();

        if (!(await fs.stat(this.repoPath).catch(() => false))) {
            console.log("[CACHE] Cloning repository with sparse checkout...");
            await git.clone(<string>Bun.env.GIT_REPO_URL, this.repoPath, ["--depth", "1", "--filter=blob:none"]);

            // Enable sparse checkout
            console.log("[CACHE] Initializing sparse checkout...");
            await git.cwd(this.repoPath).raw(["sparse-checkout", "init", "--cone"]);

            // Define the directories and specific files to include
            const sparsePaths = [
                <string>Bun.env.TEMPLATES_PATH, // Includes items.json and customization.json
                <string>Bun.env.LOCALES_PATH,  // Includes all locales files
            ];

            console.log(`[CACHE] Setting sparse-checkout paths: ${sparsePaths.join(", ")}`);
            await git.cwd(this.repoPath).raw(["sparse-checkout", "set", ...sparsePaths]);
        } else {
            console.log("[CACHE] Pulling updates with sparse checkout...");
            await git.cwd(this.repoPath).pull();
        }

        console.log("[CACHE] Fetching specific LFS-managed files...");
        try {
            // Fetch and pull only the required LFS-managed file(s)
            await git.cwd(this.repoPath).raw(["lfs", "fetch", "--include", <string>Bun.env.ITEMS_PATH]);
            await git.cwd(this.repoPath).raw(["lfs", "pull", "--include", <string>Bun.env.ITEMS_PATH]);
        } catch (error) {
            console.error("[CACHE] Error fetching LFS data:", error);
        }
    }

    // Refresh Items Cache
    private static async refreshItemsCache(): Promise<void> {
        const itemsPath = path.join(this.repoPath, <string>Bun.env.ITEMS_PATH);
        const customizationPath = path.join(this.repoPath, <string>Bun.env.CUSTOMIZATION_PATH);

        console.log(`[CACHE] Loading items from ${itemsPath}`);
        console.log(`[CACHE] Loading customization from ${customizationPath}`);

        try {
            const items = JSON.parse(await fs.readFile(itemsPath, "utf-8"));
            const customization = JSON.parse(await fs.readFile(customizationPath, "utf-8"));

            this.setCache("items", { ...items, ...customization });
        } catch (error) {
            console.error("[CACHE] Error refreshing items cache:", error);
        }
    }

    // Refresh Locales Cache
    private static async refreshLocalesCache(): Promise<void> {
        const localesDir = path.join(this.repoPath, <string>Bun.env.LOCALES_PATH);
        console.log(`[CACHE] Scanning locales directory: ${localesDir}`);

        try {
            const localeFiles = await fs.readdir(localesDir);
            let locales: ILocalesCache = {};

            for (const fileName of localeFiles) {
                if (!fileName.endsWith(".json")) {
                    console.log(`[CACHE] Skipping non-JSON file: ${fileName}`);
                    continue;
                }

                const localeName = fileName.split(".json")[0].trim(); // Extract locale name from file name
                console.log(`[CACHE] Processing locale file: ${fileName} (${localeName})`);

                const localeJson = JSON.parse(await fs.readFile(path.join(localesDir, fileName), "utf-8"));

                const templates: ILocaleCache = {};
                for (const item of Object.values(this.getCache("items"))) {
                    if (item._type === "Node" || localeJson[`${item._id} Name`] === undefined) {
                        continue;
                    }

                    templates[item._id] = {
                        Name: localeJson[`${item._id} Name`],
                        ShortName: localeJson[`${item._id} ShortName`],
                        Description: localeJson[`${item._id} Description`],
                    };
                }

                locales[localeName] = templates;
            }

            this.setCache("locales", locales);
            console.log(`[CACHE] Locales cache refreshed successfully.`);
        } catch (error) {
            console.error("[CACHE] Error refreshing locales cache:", error);
        }
    }

    // Refresh Handbook Cache
    private static async refreshHandbookCache(): Promise<void> {
        const handbookPath = path.join(this.repoPath, <string>Bun.env.HANDBOOK_PATH);
        console.log(`[CACHE] Loading handbook from ${handbookPath}`);

        try {
            const giteaHandbook = JSON.parse(await fs.readFile(handbookPath, "utf-8"));

            const handbook: IHandbookCache = {};
            for (const handbookItem of giteaHandbook.Items) {
                handbook[handbookItem.Id] = {
                    ParentId: handbookItem.ParentId,
                    Price: handbookItem.Price,
                };
            }

            this.setCache("handbook", handbook);
        } catch (error) {
            console.error("[CACHE] Error refreshing handbook cache:", error);
        }
    }

    // Refresh All Caches
    public static async refreshAllCache(): Promise<void> {
        console.log("[CACHE] Refreshing cache...");
        await this.pullRepository();
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
