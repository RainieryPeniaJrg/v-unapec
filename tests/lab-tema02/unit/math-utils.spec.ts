import { expect, test } from '@playwright/test';
import { division, factorial, suma } from '../../../src/tema02/math-utils';
import {
  ARITHMETIC_TEST_CASES,
  DIVISION_ERROR_CASES,
  FACTORIAL_TEST_CASES,
} from '../fixtures/math-utils-data';

test.describe('Tema 02 - 3A Pruebas unitarias', () => {
  // PDF: Lab-Tema02-ISO410, Ejercicio 3A
  // Criterios: ✓ Cubre suma ✓ Cubre división ✓ Cubre factorial ✓ Cubre errores división

  ARITHMETIC_TEST_CASES.forEach(({ operation, a, b, expected, description }) => {
    if (operation === 'suma') {
      test(description, () => {
        expect(suma(a, b)).toBe(expected);
      });
    } else if (operation === 'division') {
      test(description, () => {
        expect(division(a, b)).toBe(expected);
      });
    }
  });

  DIVISION_ERROR_CASES.forEach(({ shouldThrow, a, b, errorMessage, description }) => {
    if (shouldThrow) {
      test(description, () => {
        expect(() => division(a, b)).toThrow(errorMessage);
      });
    }
  });

  FACTORIAL_TEST_CASES.forEach(({ n, expectedResult, description }) => {
    test(description, () => {
      expect(factorial(n)).toBe(expectedResult);
    });
  });
});
