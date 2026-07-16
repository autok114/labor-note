import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? "/labor-note/" : "/",
  plugins: [react()],
  build: {
    outDir: "pages-dist",
    emptyOutDir: true,
  },
});
