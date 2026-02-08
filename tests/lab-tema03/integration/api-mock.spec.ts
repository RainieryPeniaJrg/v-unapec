import { expect, test } from '@playwright/test';
import type {
  ApiErrorResponse,
  LoginRequest,
  LoginResponse,
  SaldoResponse,
} from '../../../src/tema03/api-contract';

const apiBaseUrl = 'https://tema03.local';
const validUser = 'ana';
const validPassword = 'clave123';
const validToken = 'token-mock-ana';

test.describe('Tema 03 - Actividad 3 integracion API mock local', () => {
  test.beforeEach(async ({ page }) => {
    await page.route(`${apiBaseUrl}/api/login`, async (route) => {
      const request = route.request();
      const body = (request.postDataJSON() ?? {}) as Partial<LoginRequest>;

      if (!body.username || !body.password) {
        const payload: ApiErrorResponse = { error: 'payload invalido' };
        await route.fulfill({ status: 400, contentType: 'application/json', body: JSON.stringify(payload) });
        return;
      }

      if (body.username === validUser && body.password === validPassword) {
        const payload: LoginResponse = { token: validToken };
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
        return;
      }

      const payload: ApiErrorResponse = { error: 'credenciales invalidas' };
      await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify(payload) });
    });

    await page.route(`${apiBaseUrl}/api/saldo`, async (route) => {
      const authorization = route.request().headers().authorization;
      if (authorization !== `Bearer ${validToken}`) {
        const payload: ApiErrorResponse = { error: 'token requerido' };
        await route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify(payload) });
        return;
      }

      const payload: SaldoResponse = { saldo: 1350.5 };
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(payload) });
    });
  });

  test('login OK genera token y saldo responde >= 0', async ({ page }) => {
    const loginResult = await page.evaluate(async ({ apiBaseUrl, validUser, validPassword }) => {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: validUser, password: validPassword }),
      });
      return { status: response.status, body: await response.json() };
    }, { apiBaseUrl, validUser, validPassword });

    expect(loginResult.status).toBe(200);
    expect(loginResult.body.token).toBeTruthy();

    const saldoResult = await page.evaluate(async ({ apiBaseUrl, token }) => {
      const response = await fetch(`${apiBaseUrl}/api/saldo`, {
        method: 'GET',
        headers: { authorization: `Bearer ${token}` },
      });
      return { status: response.status, body: await response.json() };
    }, { apiBaseUrl, token: loginResult.body.token as string });

    expect(saldoResult.status).toBe(200);
    expect(typeof saldoResult.body.saldo).toBe('number');
    expect(saldoResult.body.saldo).toBeGreaterThanOrEqual(0);
  });

  test('saldo sin token responde 401', async ({ page }) => {
    const result = await page.evaluate(async (apiBaseUrl) => {
      const response = await fetch(`${apiBaseUrl}/api/saldo`);
      return { status: response.status, body: await response.json() };
    }, apiBaseUrl);

    expect(result.status).toBe(401);
    expect(result.body.error).toContain('token');
  });

  test('login con payload invalido responde 400', async ({ page }) => {
    const result = await page.evaluate(async (apiBaseUrl) => {
      const response = await fetch(`${apiBaseUrl}/api/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username: 'ana' }),
      });
      return { status: response.status, body: await response.json() };
    }, apiBaseUrl);

    expect(result.status).toBe(400);
    expect(result.body.error).toContain('payload');
  });
});
