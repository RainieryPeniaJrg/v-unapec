import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'path';
import { tema03Cases } from './tema03.cases';

const tema03ContextFile = path.resolve(process.cwd(), 'Contexto', 'Lab-Tema03-ISO410.pdf');

test.describe('Contexto - Tema 03', () => {
  test('archivo de contexto disponible', async () => {
    expect(fs.existsSync(tema03ContextFile)).toBeTruthy();
  });

  for (const testCase of tema03Cases) {
    test(`${testCase.id} | ${testCase.title}`, async ({ page, baseURL }) => {
      test.skip(!process.env.BASE_URL, 'Define BASE_URL para ejecutar los flujos E2E del Tema 03.');
      test.fixme(testCase.description);

      await test.step('Abrir aplicación objetivo', async () => {
        await page.goto(baseURL!);
      });
    });
  }
});
