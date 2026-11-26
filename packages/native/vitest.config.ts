import { defineConfig } from 'vitest/config';

// D114: Vitest covers plain TypeScript (.test.ts); Jest covers components
// and hooks (.test.tsx).
export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
  },
});
