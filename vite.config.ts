import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
  base: mode === 'extension' ? './' : '/',
  build: {
    outDir: mode === 'extension' ? 'dist-extension' : 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-slot', '@radix-ui/react-label', 'lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'vendor-solana': ['@solana/web3.js', '@solana/wallet-adapter-react', '@solana/wallet-adapter-react-ui'],
          'vendor-wagmi': ['wagmi', 'viem', '@tanstack/react-query'],
          'vendor-reown': ['@reown/appkit', '@walletconnect/ethereum-provider'],
        },
      },
    },
  },
  define: {
    global: "globalThis",
  },
  optimizeDeps: {
    include: ["@coinbase/onchainkit"],
  },
}));
