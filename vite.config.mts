import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Tailwind v4 Vite integration
    electron([
      { entry: 'src/main.ts' },
      { entry: 'src/preload.ts' },
    ]),
    renderer(),
  ],
});