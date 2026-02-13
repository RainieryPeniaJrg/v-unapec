import { defineConfig, devices } from '@playwright/test';

const slowMo = Number(process.env.PW_SLOWMO ?? 2000);

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  testIgnore: ['tests/banner/**'],
  timeout: 30_000,
  expect: {
    timeout: 7_000,
  },
  // Ejecución secuencial (no paralela) para visualización clara en modo headed
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Un worker a la vez para ejecución secuencial
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }]]
    : [['list'], ['html']],
  outputDir: 'test-results',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Modo headed (UI visible) para todos los tests
    headless: false,
    // slowMo configurable via env para ejecuciones mas lentas
    launchOptions: {
      slowMo,
    },
  },
  projects: [
    {
      name: 'edge',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
});
