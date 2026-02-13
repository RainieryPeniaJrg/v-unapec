/**
 * Test Data: Descuentos (Discounts)
 * Activity T03-A2: Unit Testing - Descuentos Module
 * Source: Test cases extracted from descuentos.spec.ts
 */

/**
 * Discount calculation test cases
 * Validates discount rules by category and amount
 */
export const DISCOUNT_TEST_CASES = [
  {
    category: 'A',
    monto: 999,
    expectedDiscount: 0,
    expectedPercentage: 0,
    description: 'categoria A con monto 999 aplica 0%',
  },
  {
    category: 'A',
    monto: 1000,
    expectedDiscount: 100,
    expectedPercentage: 10,
    description: 'categoria A con monto 1000 aplica 10%',
  },
  {
    category: 'A',
    monto: 2000,
    expectedDiscount: 200,
    expectedPercentage: 10,
    description: 'categoria A con monto 2000 aplica 10%',
  },
  {
    category: 'B',
    monto: 500,
    expectedDiscount: 25,
    expectedPercentage: 5,
    description: 'categoria B con monto 500 aplica 5%',
  },
];

/**
 * Invalid category test cases
 */
export const INVALID_DISCOUNT_CASES = [
  {
    category: 'X',
    monto: 500,
    expectedDiscount: 0,
    expectedPercentage: 0,
    description: 'categoria invalida aplica 0%',
  },
  {
    category: 'Z',
    monto: 1000,
    expectedDiscount: 0,
    expectedPercentage: 0,
    description: 'categoria Z (sin definir) aplica 0%',
  },
];

/**
 * Discount tiers by category
 */
export const DISCOUNT_TIERS = {
  A: { minAmount: 1000, percentage: 10 },
  B: { minAmount: 500, percentage: 5 },
  C: { minAmount: 0, percentage: 0 },
};

/**
 * Test data groups
 */
export const ALL_DISCOUNT_TEST_CASES = [
  ...DISCOUNT_TEST_CASES,
  ...INVALID_DISCOUNT_CASES,
];
