declare module "bun" {
    interface Env {
        GITEA_ITEMS_URL: string;
        GITEA_CUSTOMIZATION_URL: string;
        GITEA_HANDBOOK_URL: string;
        GITEA_LOCALES_API_URL: string;
    }
}
