# V UNAPEC - Lab Tema 02 (ISO410) en Playwright + TypeScript

Repositorio preparado para ejecutar los ejercicios del `Lab-Tema02-ISO410.pdf` con estructura profesional de testing.

## Estructura real de proyecto

- `src/tema02/`: implementaciones TypeScript de ejercicios programaticos.
- `tests/lab-tema02/unit/`: pruebas unitarias.
- `tests/lab-tema02/integration/`: pruebas de integracion.
- `tests/lab-tema02/e2e/`: pruebas de sistema E2E con Playwright (Page Object + test data).
- `web/`: HTML local para el ejercicio E2E.
- `docs/lab-tema02/`: respuestas en Markdown para ejercicios de foro/documentales.
- `Contexto/`: PDFs originales del laboratorio.

## Ejercicios cubiertos

- Ejercicio 1: `docs/lab-tema02/ejercicio1-fundamentos.md`
- Ejercicio 2A/2B: `src/tema02/calculadora.ts` + `docs/lab-tema02/ejercicio2-inspeccion-walkthrough.md`
- Ejercicio 3A: `src/tema02/math-utils.ts` + `tests/lab-tema02/unit/math-utils.spec.ts`
- Ejercicio 3B: `src/tema02/repositorio.ts`, `src/tema02/auth.ts`, `tests/lab-tema02/integration/auth.spec.ts`
- Ejercicio 4: `docs/lab-tema02/ejercicio4-uat.md`
- Ejercicio 5: `docs/lab-tema02/ejercicio5-mini-formales.md`
- Ejercicio 6: `web/calculadora.html` + `tests/lab-tema02/e2e/calculadora.e2e.spec.ts`

## Ejecucion local (Edge)

```powershell
npm ci
npx playwright install msedge
npm test
```

## Scripts

- `npm test`: ejecuta todo Tema 02.
- `npm run test:unit`: solo unitarias.
- `npm run test:integration`: solo integracion.
- `npm run test:e2e`: solo E2E.
- `npm run test:headed`: ejecucion visual en Edge.
- `npm run test:debug`: debug en Edge.
- `npm run report`: abre reporte HTML.

## Buenas practicas aplicadas

- Separacion por nivel de prueba (unit/integration/e2e).
- Page Object Model en E2E.
- Datos de prueba desacoplados.
- `test.step(...)` para trazabilidad de ejecucion.
- Matriz de trazabilidad: `docs/lab-tema02/matriz-trazabilidad.md`.
