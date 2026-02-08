# Reporte de defecto ejemplo - Tema 03

| Campo | Valor |
|---|---|
| ID | BUG-T03-001 |
| Titulo | Login permite intento vacio sin mensaje preventivo |
| Severidad | Media |
| Prioridad | Alta |
| Estado | Abierto |

## Paso a paso

1. Abrir `web/tema03-demo/index.html`.
2. Dejar usuario y password vacios.
3. Pulsar `Login`.

## Resultado esperado

Mostrar validacion explicita: "usuario y password son requeridos".

## Resultado obtenido

Se muestra mensaje generico de credenciales invalidas sin distinguir campos vacios.

## Evidencia

- `evidencias/tema03/A6-trazabilidad-defectos/BUG-T03-001.md`
- Captura sugerida: `evidencias/tema03/A6-trazabilidad-defectos/captura-login-vacio.png`
