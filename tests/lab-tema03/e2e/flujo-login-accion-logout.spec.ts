import path from 'node:path';
import { test } from '@playwright/test';
import { usuariosData } from './data/usuarios.data';
import { Tema03DemoPage } from './pages/tema03-demo.page';
import { appendE2ELog, buildE2EScreenshotPath } from '../../shared/e2e-log';
import { createTestLogger } from '../../shared/logging/log-standard';

const visualPauseMs = Number(process.env.PW_VISUAL_PAUSE ?? 1500);

test.describe('Tema 03 - Actividad 4 sistema E2E', () => {
  // PDF: Lab-Tema03-ISO410, Actividad 4
  // Criterios: ✓ Login válido ✓ Acción de negocio ✓ Logout ✓ Manejo de errores

  test('login exitoso -> accion -> logout', async ({ page }, testInfo) => {
    const logger = createTestLogger('T03-A4-001', 'flujo-login-accion-logout', 'evidencias/tema03/A4-sistema-e2e/logs');
    const startedAt = Date.now();
    const url = `file://${path.resolve(process.cwd(), 'web', 'tema03-demo', 'index.html').replace(/\\/g, '/')}`;
    const app = new Tema03DemoPage(page);
    const screenshotPath = buildE2EScreenshotPath('tema03', 'tema03-login-accion-logout');

    logger.start('Flujo de login, acción y logout');
    await page.waitForTimeout(visualPauseMs);

    try {
      await test.step('Abrir demo local', async () => {
        logger.step('Abriendo página de demostración', 'start');
        await app.goto(url);
        logger.step('Página de demostración cargada', 'success');
      });

      await test.step('Autenticar usuario valido', async () => {
        logger.step('Ingresando credenciales válidas', 'start');
        await app.login(usuariosData.valido.username, usuariosData.valido.password);
        await app.estadoAutenticadoDebeSerVisible();
        logger.step('Usuario autenticado correctamente', 'success');
      });

      await test.step('Ejecutar accion de negocio simple', async () => {
        logger.step('Ejecutando acción de negocio', 'start');
        await app.ejecutarAccion();
        await app.estadoAccionDebeSerVisible();
        logger.step('Acción ejecutada exitosamente', 'success');
      });

      await test.step('Cerrar sesion', async () => {
        logger.step('Cerrando sesión', 'start');
        await app.logout();
        await app.estadoSesionCerradaDebeSerVisible();
        logger.step('Sesión cerrada correctamente', 'success');
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

      logger.finish('PASSED');
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
      logger.finish('FAILED');
      throw error;
    }
  });

  test('login invalido muestra mensaje de error', async ({ page }, testInfo) => {
    const startedAt = Date.now();
    const url = `file://${path.resolve(process.cwd(), 'web', 'tema03-demo', 'index.html').replace(/\\/g, '/')}`;
    const app = new Tema03DemoPage(page);
    const screenshotPath = buildE2EScreenshotPath('tema03', 'tema03-login-invalido');

    try {
      await page.waitForTimeout(visualPauseMs);
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
