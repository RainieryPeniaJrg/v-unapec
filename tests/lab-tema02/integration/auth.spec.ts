import { expect, test } from '@playwright/test';
import { AuthService } from '../../../src/tema02/auth';
import { RepoUsuarios } from '../../../src/tema02/repositorio';

test.describe('Tema 02 - 3B Prueba de integracion', () => {
  test('login integra repo y servicio', () => {
    const repo = new RepoUsuarios();
    const auth = new AuthService(repo);

    expect(auth.puedeLogin('ana', true)).toBeTruthy();
    expect(auth.puedeLogin('ana', false)).toBeFalsy();
    expect(auth.puedeLogin('luis', true)).toBeFalsy();
    expect(auth.puedeLogin('otro', true)).toBeFalsy();
  });
});
