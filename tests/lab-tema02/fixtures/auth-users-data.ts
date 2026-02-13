/**
 * Test Data: Authentication Users
 * Exercise T02-E3B: Integration Testing - Auth Service
 * Source: User test cases extracted from auth.spec.ts
 */

/**
 * Test users for authentication integration testing
 * Each user has different access levels to test combinations
 */
export const AUTH_TEST_USERS = [
  {
    username: 'ana',
    esActivo: true,
    puedeLogin: true,
    description: 'Usuario activo - puede hacer login',
  },
  {
    username: 'ana',
    esActivo: false,
    puedeLogin: false,
    description: 'Usuario inactivo - no puede hacer login',
  },
  {
    username: 'luis',
    esActivo: true,
    puedeLogin: false,
    description: 'Usuario inactivo en sistema - no puede hacer login',
  },
  {
    username: 'otro',
    esActivo: true,
    puedeLogin: false,
    description: 'Usuario no registrado - no puede hacer login',
  },
];

/**
 * Valid test credentials
 */
export const VALID_AUTH_USERS = ['ana'];

/**
 * Invalid test users
 */
export const INVALID_AUTH_USERS = ['luis', 'otro'];
