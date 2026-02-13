import { expect, test } from '@playwright/test';
import { AuthService } from '../../../src/tema02/auth';
import { RepoUsuarios } from '../../../src/tema02/repositorio';
import { AUTH_TEST_USERS } from '../fixtures/auth-users-data';

test.describe('Tema 02 - 3B Prueba de integracion', () => {
  // PDF: Lab-Tema02-ISO410, Ejercicio 3B
  // Criterios: ✓ Integración AuthService + RepoUsuarios ✓ Validar estados de usuario

  test('login integra repo y servicio', () => {
    const repo = new RepoUsuarios();
    const auth = new AuthService(repo);

    AUTH_TEST_USERS.forEach(({ username, esActivo, puedeLogin }) => {
      const resultado = auth.puedeLogin(username, esActivo);
      if (puedeLogin) {
        expect(resultado).toBeTruthy();
      } else {
        expect(resultado).toBeFalsy();
      }
    });
  });
});
