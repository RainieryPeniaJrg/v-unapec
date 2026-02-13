/**
 * Test Data: Math Utils
 * Exercise T02-E3A: Unit Testing - Math Utilities
 * Source: Parametrized test cases extracted from math-utils.spec.ts
 */

/**
 * Factorial test cases
 * Used to validate factorial(n) calculations
 */
export const FACTORIAL_TEST_CASES = [
  { n: 0, expectedResult: 1, description: 'factorial(0) == 1' },
  { n: 1, expectedResult: 1, description: 'factorial(1) == 1' },
  { n: 5, expectedResult: 120, description: 'factorial(5) == 120' },
];

/**
 * Basic arithmetic test cases
 */
export const ARITHMETIC_TEST_CASES = [
  {
    operation: 'suma',
    a: 2,
    b: 3,
    expected: 5,
    description: 'suma(2,3) devuelve 5',
  },
  {
    operation: 'division',
    a: 10,
    b: 2,
    expected: 5,
    description: 'division(10,2) devuelve 5',
  },
];

/**
 * Division error cases
 */
export const DIVISION_ERROR_CASES = [
  {
    a: 1,
    b: 0,
    shouldThrow: true,
    errorMessage: 'b no puede ser 0',
    description: 'division(1,0) lanza error',
  },
];
