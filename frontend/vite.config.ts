import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": path.resolve(process.cwd(), "src"),
      "@support": path.resolve(process.cwd(), "cypress/support"),
      "@fixtures": path.resolve(process.cwd(), "cypress/fixtures")
    }
  }
});
