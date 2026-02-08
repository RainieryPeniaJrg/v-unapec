import path from 'node:path';
import { test } from '@playwright/test';
import { usuariosData } from './data/usuarios.data';
import { Tema03DemoPage } from './pages/tema03-demo.page';
import { appendE2ELog, buildE2EScreenshotPath } from '../../shared/e2e-log';

test.describe('Tema 03 - Actividad 4 sistema E2E', () => {
  test('login exitoso -> accion -> logout', async ({ page }, testInfo) => {
    const startedAt = Date.now();
    const url = `file://${path.resolve(process.cwd(), 'web', 'tema03-demo', 'index.html').replace(/\\/g, '/')}`;
    const app = new Tema03DemoPage(page);
    const screenshotPath = buildE2EScreenshotPath('tema03', 'tema03-login-accion-logout');

    try {
      await test.step('Abrir demo local', async () => {
        await app.goto(url);
      });

      await test.step('Autenticar usuario valido', async () => {
        await app.login(usuariosData.valido.username, usuariosData.valido.password);
        await app.estadoAutenticadoDebeSerVisible();
      });

      await test.step('Ejecutar accion de negocio simple', async () => {
        await app.ejecutarAccion();
        await app.estadoAccionDebeSerVisible();
      });

      await test.step('Cerrar sesion', async () => {
        await app.logout();
        await app.estadoSesionCerradaDebeSerVisible();
      });

      await page.screenshot({ path: screenshotPath, fullPage: true });
      appendE2ELog(
        {
          fecha_hora: new Date().toISOString(),
          suite: 'tema03',
          caso: testInfo.title,
          sitio_o_url: url,
          estado: 'exitoso',
          duracion_ms: Date.now() - startedAt,
          navegador: testInfo.project.name,
          capturas: [screenshotPath],
        },
        { suite: 'tema03' },
      );
    } catch (error) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      appendE2ELog(
        {
          fecha_hora: new Date().toISOString(),
          suite: 'tema03',
          caso: testInfo.title,
          sitio_o_url: url,
          estado: 'fallido',
          duracion_ms: Date.now() - startedAt,
          navegador: testInfo.project.name,
          capturas: [screenshotPath],
          detalle_error: error instanceof Error ? error.message : 'Error desconocido',
        },
        { suite: 'tema03' },
      );
      throw error;
    }
  });

  test('login invalido muestra mensaje de error', async ({ page }, testInfo) => {
    const startedAt = Date.now();
    const url = `file://${path.resolve(process.cwd(), 'web', 'tema03-demo', 'index.html').replace(/\\/g, '/')}`;
    const app = new Tema03DemoPage(page);
    const screenshotPath = buildE2EScreenshotPath('tema03', 'tema03-login-invalido');

    try {
      await app.goto(url);
      await app.login(usuariosData.invalido.username, usuariosData.invalido.password);
      await app.errorCredencialesDebeSerVisible();

      await page.screenshot({ path: screenshotPath, fullPage: true });
      appendE2ELog(
        {
          fecha_hora: new Date().toISOString(),
          suite: 'tema03',
          caso: testInfo.title,
          sitio_o_url: url,
          estado: 'exitoso',
          duracion_ms: Date.now() - startedAt,
          navegador: testInfo.project.name,
          capturas: [screenshotPath],
        },
        { suite: 'tema03' },
      );
    } catch (error) {
      await page.screenshot({ path: screenshotPath, fullPage: true });
      appendE2ELog(
        {
          fecha_hora: new Date().toISOString(),
          suite: 'tema03',
          caso: testInfo.title,
          sitio_o_url: url,
          estado: 'fallido',
          duracion_ms: Date.now() - startedAt,
          navegador: testInfo.project.name,
          capturas: [screenshotPath],
          detalle_error: error instanceof Error ? error.message : 'Error desconocido',
        },
        { suite: 'tema03' },
      );
      throw error;
    }
  });
});
