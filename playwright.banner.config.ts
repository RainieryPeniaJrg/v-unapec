import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

const slowMo = Number(process.env.PW_SLOWMO_BANNER ?? 6000);

export default defineConfig({
  testDir: './tests/banner/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 120_000,
  expect: {
    timeout: 20_000,
  },
  // Ejecución secuencial para visualización clara
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never', outputFolder: 'playwright-report-banner' }]]
    : [['list'], ['html', { outputFolder: 'playwright-report-banner' }]],
  outputDir: 'test-results/banner',
  use: {
    baseURL: 'https://landing.unapec.edu.do/banner/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on',
    // slowMo configurable via env para ejecuciones mas lentas
    // Permite explicar paso a paso cada interaccion del usuario (login, navegacion, clicks)
    launchOptions: {
      slowMo,
    },
    // Modo headed (UI visible) para todos los tests de Banner
    headless: false,
  },
  projects: [
    {
      name: 'edge-banner',
      use: {
        ...devices['Desktop Edge'],
        channel: 'msedge',
      },
    },
  ],
});
