import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.test.ts'],
    // The end-to-end tests run the compiled CLI, so the build runs once before any test file;
    // .test-work/ is removed after the last one.
    globalSetup: ['test/setup/build.ts', 'test/setup/scratch.ts'],
    testTimeout: 20_000,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      reporter: ['text', 'json-summary'],
    },
  },
});
