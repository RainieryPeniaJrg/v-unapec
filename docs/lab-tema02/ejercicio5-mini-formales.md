# Ejercicio 5 - Mini metodos formales

## Proposiciones

- `A`: cuenta activa.
- `P`: password valida.
- `L`: login permitido.

## Especificacion formal

`L <-> (A ^ P)`

## Tabla de verdad

| A | P | A ^ P | L |
|---|---|---|---|
| V | V | V | V |
| V | F | F | F |
| F | V | F | F |
| F | F | F | F |

## Reflexion

La especificacion formal hace explicita la regla de negocio y evita interpretaciones ambiguas. La tabla permite validar rapidamente todos los estados posibles del login.
