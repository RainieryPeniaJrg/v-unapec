import { expect, test } from '@playwright/test';
import { calcularDescuento } from '../../../src/tema03/descuentos';
import { ALL_DISCOUNT_TEST_CASES } from '../fixtures/descuentos-data';

test.describe('Tema 03 - Actividad 2 unitarias', () => {
  // PDF: Lab-Tema03-ISO410, Actividad 2
  // Criterios: ✓ Cubre categorías A, B ✓ Cubre límites de monto ✓ Maneja categorías inválidas

  ALL_DISCOUNT_TEST_CASES.forEach(({ category, monto, expectedDiscount, description }) => {
    test(description, () => {
      expect(calcularDescuento(monto, category)).toBe(expectedDiscount);
    });
  });
});
