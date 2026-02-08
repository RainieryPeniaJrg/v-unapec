import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'path';
import { tema02Cases } from './tema02.cases';

const tema02ContextFile = path.resolve(process.cwd(), 'Contexto', 'Lab-Tema02-ISO410.pdf');

test.describe('Contexto - Tema 02', () => {
  test('archivo de contexto disponible', async () => {
    expect(fs.existsSync(tema02ContextFile)).toBeTruthy();
  });

  for (const testCase of tema02Cases) {
    test(`${testCase.id} | ${testCase.title}`, async ({ page, baseURL }) => {
      test.skip(!process.env.BASE_URL, 'Define BASE_URL para ejecutar los flujos E2E del Tema 02.');
      test.fixme(testCase.description);

      await test.step('Abrir aplicación objetivo', async () => {
        await page.goto(baseURL!);
      });
    });
  }
});
