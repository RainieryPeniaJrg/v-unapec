# V UNAPEC - ISO410 Labs con Playwright + TypeScript (Edge)

Repositorio estructurado para ejecutar laboratorios del curso ISO410 con enfoque de testing por niveles y trazabilidad documental.

## ✨ NUEVO: Todos los tests en modo Headed (UI Visible)

A partir de Feb 11, 2026, **todos los tests de Playwright se ejecutan en modo headed** (navegador visible) con visualización clara de cada paso:

```bash
# Executar con UI visible (RECOMENDADO para ver flujo):
npm run test:tema02:e2e        # Calculadora E2E
npm run test:tema03:e2e        # Login/Logout E2E  
npm run test:banner            # Banner Sistema Real
npm run test:e2e:all           # TODOS juntos

# Opción: sin UI (para CI/CD):
npm run test:tema02:e2e:headless
npm run test:tema03:e2e:headless
npm run test:banner:headless
npm run test:e2e:all:headless
```

**Características:**
- ✅ Browser visible durante ejecución
- ✅ slowMo ralentiza acciones para seguimiento visual
- ✅ Ejecución secuencial (no paralela)
- ✅ Videos/screenshots automáticos en fallos
- ✅ JSONL logs en `evidencias/tema*/logs/`

👉 **Guía completa:** Ver [docs/GUIA_EJECUCION_TESTS.md](docs/GUIA_EJECUCION_TESTS.md)

## Laboratorios incluidos

- Tema 02: `tests/lab-tema02/` y `docs/lab-tema02/`.
- Tema 03: `tests/lab-tema03/`, `docs/lab-tema03/` y `evidencias/tema03/`.
- Banner E2E real: `tests/banner/e2e/`, `docs/banner/` y `evidencias/banner/`.

## Estructura principal

- `src/tema02/` y `src/tema03/`: implementaciones TypeScript.
- `tests/lab-tema02/` y `tests/lab-tema03/`: suites por laboratorio.
- `web/`: demos locales para pruebas E2E.
- `docs/`: respuestas/documentos en Markdown.
- `evidencias/tema03/`: carpetas A1..A6 para capturas y reportes.
- `Contexto/`: PDFs fuente.

## Ejecucion base (Edge)

```powershell
npm ci
npx playwright install msedge
npm test
```

## Scripts Principales
- `npm run test:unit`: unitarias Tema 02.
- `npm run test:integration`: integracion Tema 02.
- `npm run test:e2e`: E2E Tema 02.
- `npm run test:tema03`: toda la suite Tema 03.
- `npm run test:tema03:unit`: unitarias Tema 03.
- `npm run test:tema03:integration`: integracion API mock Tema 03.
- `npm run test:tema03:e2e`: sistema E2E Tema 03.
- `npm run test:tema03:perf`: script k6 de rendimiento Tema 03.
- `npm run evidencias:tema03`: valida estructura minima de `evidencias/tema03`.
- `npm run test:banner`: suite real de Banner (headless).
- `npm run test:banner:headed`: suite Banner visible en Edge + video.
- `npm run test:banner:debug`: depuracion suite Banner.
- `npm run test:banner:ui`: UI mode para suite Banner.
- `npm run test:banner:report`: abre reporte HTML de Banner.
- `npm run test:headed`: ejecucion visual en Edge.
- `npm run test:debug`: depuracion en Edge.
- `npm run report`: abre reporte HTML.

## Tema 03 - Entregables clave

- Actividad 1: `docs/lab-tema03/actividad1-equivalencias-limites.md`
- Actividad 2: `src/tema03/descuentos.ts` + `tests/lab-tema03/unit/descuentos.spec.ts`
- Actividad 3: `tests/lab-tema03/integration/api-mock.spec.ts`
- Actividad 4: `web/tema03-demo/index.html` + `tests/lab-tema03/e2e/flujo-login-accion-logout.spec.ts`
- Actividad 5: `tests/lab-tema03/performance/saldo-load.k6.js`
- Actividad 6: `docs/lab-tema03/matriz-trazabilidad.md` + `docs/lab-tema03/reporte-defecto-ejemplo.md`

## Buenas practicas aplicadas

- Separacion por nivel de prueba: unidad, integracion, sistema, performance.
- Page Object Model y test data desacoplada en E2E.
- `test.step(...)` para trazabilidad de ejecucion.
- Documentacion de apoyo y matriz de trazabilidad por laboratorio.
- Credenciales sensibles por variables de entorno para escenarios reales.
