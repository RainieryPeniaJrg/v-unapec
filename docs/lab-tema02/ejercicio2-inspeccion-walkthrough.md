# Ejercicio 2 - Inspeccion breve y Walkthrough

## 2A) Checklist minima

- [x] Nombres claros y consistentes.
- [x] Manejo de errores y excepciones.
- [x] Validacion de entradas.
- [x] Casos borde (cero, negativos, nulos, extremos).
- [x] Comentarios/docstrings orientados a comportamiento.

## 2A) Hallazgos (src/tema02/calculadora.ts)

| ID | Descripcion | Severidad | Recomendacion |
|---|---|---|---|
| INS-001 | `dividir` no valida `b === 0`; puede producir `Infinity` o error en tiempo de ejecucion no controlado. | Alta | Agregar guard clause y lanzar error explicito cuando `b` sea 0. |
| INS-002 | `dividir` no valida tipos de entrada; si entran valores no numericos, el resultado puede ser `NaN`. | Media | Validar que `a` y `b` sean numeros finitos antes de operar. |
| INS-003 | `porcentaje` usa `Math.trunc` y pierde precision para resultados decimales esperados. | Media | Definir politica de redondeo (ej. `toFixed(2)` o `Math.round`) segun regla de negocio. |

## 2B) Walkthrough guiado

Primero ejecuto `dividir(10, 2)` para confirmar el camino valido esperado.  
Luego pruebo `dividir(10, 0)` para evidenciar el caso borde no manejado.  
Despues valido `dividir(NaN, 2)` y `dividir(10, Number.POSITIVE_INFINITY)` para entradas invalidas.  
En `porcentaje`, pruebo `porcentaje(1000, 15)` como caso normal y `porcentaje(999, 12.5)` para precision decimal.  
Tambien reviso `porcentaje(100, -5)` y `porcentaje(100, 250)` para rangos fuera de norma.  
Mejora propuesta: centralizar validaciones en una funcion privada reutilizable y estandarizar errores.

## Reflexion

El walkthrough expone rapidamente defectos funcionales sin depender de una bateria grande de pruebas. Tambien ayuda a alinear criterios entre pares antes de corregir codigo.
