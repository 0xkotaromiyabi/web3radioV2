import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/cryptopanic-api': {
        target: 'https://cryptopanic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cryptopanic-api/, ''),
      },
    },
  },
  plugins: [
    nodePolyfills(),
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/",
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["@coinbase/onchainkit"],
  },
}));
