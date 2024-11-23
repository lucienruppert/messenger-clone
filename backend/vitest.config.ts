import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

// Use ESM format for Vite config
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  plugins: [swc.vite()],
});
