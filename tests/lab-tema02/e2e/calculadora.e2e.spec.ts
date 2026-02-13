import path from 'node:path';
import { expect, test } from '@playwright/test';
import { calculadoraData } from './data/calculadora.data';
import { CalculadoraPage } from './pages/calculadora.page';
import { appendE2ELog, buildE2EScreenshotPath } from '../../shared/e2e-log';
import { createTestLogger } from '../../shared/logging/log-standard';

const visualPauseMs = Number(process.env.PW_VISUAL_PAUSE ?? 2000);

test.describe('Tema 02 - 6B E2E Playwright (Edge)', () => {
  // PDF: Lab-Tema02-ISO410, Ejercicio 6
  // Criterios: ✓ Test E2E de calculadora local ✓ Validación de operaciones aritméticas

  test('suma local 2 + 3 = 5', async ({ page, browserName }, testInfo) => {
    const logger = createTestLogger('T02-E6-001', 'suma-calculadora', 'evidencias/tema02/E6-e2e/logs');
    const startedAt = Date.now();
    test.skip(browserName !== 'chromium', 'Edge se ejecuta sobre motor Chromium.');

    const url = `file://${path.resolve(process.cwd(), 'web', 'calculadora.html').replace(/\\/g, '/')}`;
    const calcPage = new CalculadoraPage(page);
    const screenshotPath = buildE2EScreenshotPath('tema02', 'calculadora-e2e');

    logger.start('Prueba E2E de suma (2 + 3 = 5)');
    await page.waitForTimeout(visualPauseMs);

    try {
      await test.step('Abrir calculadora local', async () => {
        logger.step('Abriendo calculadora local', 'start');
        await calcPage.goto(url);
        logger.step('Calculadora cargada', 'success');
      });

      await test.step('Ejecutar suma', async () => {
        logger.step('Ingresando valores 2 + 3', 'start');
        await calcPage.sumar(calculadoraData.sumaSimple.a, calculadoraData.sumaSimple.b);
        logger.step('Operación de suma ejecutada', 'success');
      });

      await test.step('Validar resultado', async () => {
        logger.step('Validando resultado esperado: 5', 'start');
        await expect(await calcPage.resultado()).toBe(calculadoraData.sumaSimple.esperado);
        logger.step('Resultado validado correctamente', 'success');
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

      logger.finish('PASSED');
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

      logger.finish('FAILED');
      throw error;
    }
  });
});
