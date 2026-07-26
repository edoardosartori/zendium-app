import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

export default defineConfig({
  base: "./",

  plugins: [react(), svgr()],

  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "assets"),
      "@views": path.resolve(__dirname, "src/views"),
      "@transitions": path.resolve(__dirname, "src/transitions")
    },
  },

  server: {
    port: 8080,
    strictPort: true,
  },
});
