# Actividad 1 - Particion de equivalencias y valores limite

## Regla

`0 <= edad <= 120`

## Clases de equivalencia

| Clase | Tipo | Rango |
|---|---|---|
| A | Invalida | edad < 0 |
| B | Valida | 0 <= edad <= 120 |
| C | Invalida | edad > 120 |

## Casos minimos representativos

| ID caso | Dato | Clase | Resultado esperado | Prioridad |
|---|---|---|---|---|
| A-01 | -1 | A | Rechazar edad | Alta |
| B-01 | 35 | B | Aceptar edad | Alta |
| C-01 | 121 | C | Rechazar edad | Alta |
| B-L1 | 0 | B (limite inferior) | Aceptar edad | Alta |
| B-L2 | 120 | B (limite superior) | Aceptar edad | Alta |

## Justificacion breve

Cada clase invalida se cubre con un representante fuera del dominio y la clase valida con un valor intermedio estable.  
Los limites 0 y 120 reducen riesgo de error en condiciones borde de comparacion.
