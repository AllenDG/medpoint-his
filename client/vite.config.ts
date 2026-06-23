import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  base: "/",
  server: {
    port: 3000,
    proxy: { "/api": "http://localhost:4000" },
    // Serve index.html for all routes in dev (SPA fallback)
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
  preview: {
    port: 4173,
    // SPA fallback in `vite preview`
    strictPort: false,
  },
});
