# V UNAPEC - Playwright E2E

Estructura base para automatizar en TypeScript los laboratorios ubicados en `Contexto`.

## Estructura

- `Contexto/`: documentos fuente de los laboratorios.
- `tests/contexto/tema02/`: casos y specs del Lab Tema 02.
- `tests/contexto/tema03/`: casos y specs del Lab Tema 03.
- `tests/contexto/shared/`: tipos y utilidades compartidas.

## Configuracion rapida

1. Instalar dependencias:

```bash
npm ci
```

2. Definir URL de la app bajo prueba:

```bash
# PowerShell
$env:BASE_URL="http://tu-aplicacion"
```

3. Ejecutar pruebas:

```bash
npm test
```

## Scripts utiles

- `npm test`: ejecuta todo.
- `npm run test:tema02`: ejecuta solo Tema 02.
- `npm run test:tema03`: ejecuta solo Tema 03.
- `npm run test:ui`: abre UI mode.
- `npm run report`: abre reporte HTML.

## Nota

Los casos iniciales estan en formato plantilla (`tema02.cases.ts` y `tema03.cases.ts`).
Debes convertir cada paso de los PDFs en acciones Playwright dentro de los `test.step(...)`.
