import path from 'node:path';
import { expect, test } from '@playwright/test';
import { calculadoraData } from './data/calculadora.data';
import { CalculadoraPage } from './pages/calculadora.page';
import { appendE2ELog, buildE2EScreenshotPath } from '../../shared/e2e-log';

test.describe('Tema 02 - 6B E2E Playwright (Edge)', () => {
  test('suma local 2 + 3 = 5', async ({ page, browserName }, testInfo) => {
    const startedAt = Date.now();
    test.skip(browserName !== 'chromium', 'Edge se ejecuta sobre motor Chromium.');

    const url = `file://${path.resolve(process.cwd(), 'web', 'calculadora.html').replace(/\\/g, '/')}`;
    const calcPage = new CalculadoraPage(page);
    const screenshotPath = buildE2EScreenshotPath('tema02', 'calculadora-e2e');

    try {
      await test.step('Abrir calculadora local', async () => {
        await calcPage.goto(url);
      });

      await test.step('Ejecutar suma', async () => {
        await calcPage.sumar(calculadoraData.sumaSimple.a, calculadoraData.sumaSimple.b);
      });

      await test.step('Validar resultado', async () => {
        await expect(await calcPage.resultado()).toBe(calculadoraData.sumaSimple.esperado);
      });

      await page.screenshot({ path: screenshotPath, fullPage: true });

      appendE2ELog(
        {
          fecha_hora: new Date().toISOString(),
          suite: 'tema02',
          caso: testInfo.title,
          sitio_o_url: url,
          estado: 'exitoso',
          duracion_ms: Date.now() - startedAt,
          navegador: testInfo.project.name,
          capturas: [screenshotPath],
        },
        { suite: 'tema02' },
      );
    } catch (error) {
      await page.screenshot({ path: screenshotPath, fullPage: true });

      appendE2ELog(
        {
          fecha_hora: new Date().toISOString(),
          suite: 'tema02',
          caso: testInfo.title,
          sitio_o_url: url,
          estado: 'fallido',
          duracion_ms: Date.now() - startedAt,
          navegador: testInfo.project.name,
          capturas: [screenshotPath],
          detalle_error: error instanceof Error ? error.message : 'Error desconocido',
        },
        { suite: 'tema02' },
      );
      throw error;
    }
  });
});
