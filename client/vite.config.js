import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",  // Vercel expects the output here
    emptyOutDir: true,
  },
  server: {
    port: 3000, // Local development server port
  }
});
