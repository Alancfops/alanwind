// D114: Jest (jest-expo) covers components and hooks (.test.tsx); Vitest
// covers plain TypeScript (.test.ts).
module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/test/**/*.test.tsx'],
};
