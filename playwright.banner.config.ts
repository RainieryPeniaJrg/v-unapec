import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests/banner/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 120_000,
  expect: {
    timeout: 20_000,
  },
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
    // slowMo ralentiza cada accion Playwright (en ms) para propositos educativos/demostracion
    // Permite explicar paso a paso cada interaccion del usuario (login, navegacion, clicks)
    slowMo: 1500,
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
