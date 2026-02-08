# Matriz de trazabilidad - Lab Tema 02

| ID Req | Descripcion Req | ID Caso | Nivel | Resultado | Evidencia | Observaciones |
|---|---|---|---|---|---|---|
| T02-E1 | Diferenciar verificacion y validacion | DOC-E1 | Documental | Pass | `docs/lab-tema02/ejercicio1-fundamentos.md` | Tabla y reflexion incluidas. |
| T02-E2 | Inspeccion + walkthrough de calculadora imperfecta | DOC-E2 | Documental | Pass | `docs/lab-tema02/ejercicio2-inspeccion-walkthrough.md` | Checklist y 3 hallazgos completos. |
| T02-E3A | Unitarias para suma/division/factorial | T02-UT-001..006 | Unit | Pass | `tests/lab-tema02/unit/math-utils.spec.ts` | Casos base, error y parametrizados. |
| T02-E3B | Integracion RepoUsuarios + AuthService | T02-INT-001 | Integracion | Pass | `tests/lab-tema02/integration/auth.spec.ts` | Contrato entre modulos validado. |
| T02-E4 | UAT rapida de registro con email valido | DOC-E4 | Manual/UAT | Pass | `docs/lab-tema02/ejercicio4-uat.md` | Simulacion documentada. |
| T02-E5 | Especificacion formal y tabla de verdad | DOC-E5 | Documental | Pass | `docs/lab-tema02/ejercicio5-mini-formales.md` | Logica booleana completa. |
| T02-E6 | E2E local Playwright calculadora | T02-E2E-001 | Sistema/E2E | Pass | `tests/lab-tema02/e2e/calculadora.e2e.spec.ts` | Ejecutado en proyecto Edge. |
