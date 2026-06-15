import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      "/predict": "http://localhost:8000",
      "/health": "http://localhost:8000",
      "/reports": "http://localhost:8000",
      "/results/": "http://localhost:8000",
      "/eval": "http://localhost:8000",
      "/training": "http://localhost:8000",
    },
  },
});
