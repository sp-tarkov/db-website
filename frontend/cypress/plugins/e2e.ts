import path from "node:path";
import vitePreprocessor from "cypress-vite";

export default async (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  on("file:preprocessor", vitePreprocessor({
    configFile: path.resolve(process.cwd(), "vite.config.ts"),
    mode: "development"
  }));
  (await import("@cypress/code-coverage/task")).default(on, config);

  return config;
};
