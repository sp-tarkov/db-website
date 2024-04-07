import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    experimentalRunAllSpecs: true,
    baseUrl: "http://localhost:5173",
    video: false,
    async setupNodeEvents(on, config) {
      return (await import("./cypress/plugins/e2e")).default(on, config);
    }
  },
  env: {
    VITE_SPTARKOV_HOME: "https://www.sp-tarkov.com/",
    VITE_SPTARKOV_WORKSHOP: "https://mods.sp-tarkov.com/",
    VITE_SPTARKOV_DOCUMENTATION: "https://docs.sp-tarkov.com/"
  }
});
