import path from 'node:path';
import { test } from '@playwright/test';
import { usuariosData } from './data/usuarios.data';
import { Tema03DemoPage } from './pages/tema03-demo.page';

test.describe('Tema 03 - Actividad 4 sistema E2E', () => {
  test('login exitoso -> accion -> logout', async ({ page }) => {
    const url = `file://${path.resolve(process.cwd(), 'web', 'tema03-demo', 'index.html').replace(/\\/g, '/')}`;
    const app = new Tema03DemoPage(page);

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
  });

  test('login invalido muestra mensaje de error', async ({ page }) => {
    const url = `file://${path.resolve(process.cwd(), 'web', 'tema03-demo', 'index.html').replace(/\\/g, '/')}`;
    const app = new Tema03DemoPage(page);

    await app.goto(url);
    await app.login(usuariosData.invalido.username, usuariosData.invalido.password);
    await app.errorCredencialesDebeSerVisible();
  });
});
