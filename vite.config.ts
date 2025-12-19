import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const normalizeBase = (value?: string) => {
      if (!value) return '/';
      const withLeading = value.startsWith('/') ? value : `/${value}`;
      return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
    };

    return {
      base: normalizeBase(env.VITE_BASE_URL),
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
