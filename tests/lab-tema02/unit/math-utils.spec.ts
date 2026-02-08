import { expect, test } from '@playwright/test';
import { division, factorial, suma } from '../../../src/tema02/math-utils';

test.describe('Tema 02 - 3A Pruebas unitarias', () => {
  test('suma(2,3) devuelve 5', () => {
    expect(suma(2, 3)).toBe(5);
  });

  test('division(10,2) devuelve 5', () => {
    expect(division(10, 2)).toBe(5);
  });

  test('division(1,0) lanza error', () => {
    expect(() => division(1, 0)).toThrow('b no puede ser 0');
  });

  [
    { n: 0, esperado: 1 },
    { n: 1, esperado: 1 },
    { n: 5, esperado: 120 },
  ].forEach(({ n, esperado }) => {
    test(`factorial(${n}) == ${esperado}`, () => {
      expect(factorial(n)).toBe(esperado);
    });
  });
});
