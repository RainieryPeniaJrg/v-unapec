import path from 'node:path';
import { expect, test } from '@playwright/test';
import { calculadoraData } from './data/calculadora.data';
import { CalculadoraPage } from './pages/calculadora.page';

test.describe('Tema 02 - 6B E2E Playwright (Edge)', () => {
  test('suma local 2 + 3 = 5', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'Edge se ejecuta sobre motor Chromium.');

    const url = `file://${path.resolve(process.cwd(), 'web', 'calculadora.html').replace(/\\/g, '/')}`;
    const calcPage = new CalculadoraPage(page);

    await test.step('Abrir calculadora local', async () => {
      await calcPage.goto(url);
    });

    await test.step('Ejecutar suma', async () => {
      await calcPage.sumar(calculadoraData.sumaSimple.a, calculadoraData.sumaSimple.b);
    });

    await test.step('Validar resultado', async () => {
      await expect(await calcPage.resultado()).toBe(calculadoraData.sumaSimple.esperado);
    });
  });
});
