import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

import { fileURLToPath } from "url";
import path, { dirname } from "path";

// حل لمشكلة __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// نجهز الإعدادات العامة
const baseConfig = {
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    hmr: {
      overlay: false,
    },
  },
};

export default defineConfig((env) => {
  const isReplit = env.mode !== "production" && !!process.env.REPL_ID;

  if (isReplit) {
    const { cartographer } = require("@replit/vite-plugin-cartographer");
    baseConfig.plugins.push(cartographer());
  }

  return baseConfig;
});
