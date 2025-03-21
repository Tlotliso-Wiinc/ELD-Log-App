import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react(), tailwindcss(), reactRouter(), tsconfigPaths()],
  build: {
    outDir: 'build/client',
    assetsDir: 'static' // This changes /assets to /static
  }
});
