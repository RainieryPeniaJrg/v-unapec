# Matriz de trazabilidad - Lab Tema 03

| ID Req | Descripcion Req | ID Caso | Nivel | Resultado | Evidencia | Observaciones |
|---|---|---|---|---|---|---|
| T03-A1 | Diseno con equivalencias y limites | T03-A1-CASES | Documental | Pass | `docs/lab-tema03/actividad1-equivalencias-limites.md` | Incluye clases invalidas/validas y limites. |
| T03-A2 | Unitarias calcularDescuento | T03-A2-UT-001..005 | Unidad | Pass | `tests/lab-tema03/unit/descuentos.spec.ts` | Cubre 999, 1000, 2000, B y categoria invalida. |
| T03-A3 | Integracion API contrato login/saldo | T03-A3-INT-001..003 | Integracion | Pass | `tests/lab-tema03/integration/api-mock.spec.ts` | Incluye happy path + 401 + 400. |
| T03-A4 | Sistema E2E login->accion->logout | T03-A4-E2E-001..002 | Sistema | Pass | `tests/lab-tema03/e2e/flujo-login-accion-logout.spec.ts` | Demo local estable con POM y test data. |
| T03-A5 | Rendimiento carga suave | T03-A5-PERF-001 | Performance | Planned | `tests/lab-tema03/performance/saldo-load.k6.js` | Requiere ejecutar k6 en terminal local. |
| T03-A6 | Matriz y defecto | T03-A6-DOC-001 | Documental | Pass | `docs/lab-tema03/actividad6-trazabilidad.md` | Incluye formato de reporte de bug. |
