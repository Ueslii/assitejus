import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // Importe o 'path' do Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adicione esta seção 'resolve'
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
