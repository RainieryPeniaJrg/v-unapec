# Actividad 3 - Integracion API (equivalente a Postman usando Playwright mock)

## Coleccion logica: Validacion-Integracion

### 1) POST /login

- Request body valido:
```json
{
  "username": "ana",
  "password": "clave123"
}
```
- Validaciones:
  - Status `200`
  - `token` existe y no esta vacio

### 2) GET /saldo

- Header requerido: `Authorization: Bearer <token>`
- Validaciones:
  - Status `200`
  - `saldo` es numero
  - `saldo >= 0`

### 3) Casos de error

- `401` sin token en `/saldo`.
- `400` con payload invalido en `/login`.

## Mapeo a implementacion

- Suite: `tests/lab-tema03/integration/api-mock.spec.ts`
- Endpoint simulado localmente con `page.route(...).fulfill(...)`.
- Assertions equivalentes a tests de Postman para estado y estructura de payload.
