import { expect, test } from '@playwright/test';
import { calcularDescuento } from '../../../src/tema03/descuentos';

test.describe('Tema 03 - Actividad 2 unitarias', () => {
  test('categoria A con monto 999 aplica 0%', () => {
    expect(calcularDescuento(999, 'A')).toBe(0);
  });

  test('categoria A con monto 1000 aplica 10%', () => {
    expect(calcularDescuento(1000, 'A')).toBe(100);
  });

  test('categoria A con monto 2000 aplica 10%', () => {
    expect(calcularDescuento(2000, 'A')).toBe(200);
  });

  test('categoria B con monto 500 aplica 5%', () => {
    expect(calcularDescuento(500, 'B')).toBe(25);
  });

  test('categoria invalida aplica 0%', () => {
    expect(calcularDescuento(500, 'X')).toBe(0);
  });
});
