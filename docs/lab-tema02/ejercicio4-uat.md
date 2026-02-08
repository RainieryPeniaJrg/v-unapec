# Ejercicio 4 - Aceptacion (UAT rapida)

## User Story

Como usuario, quiero registrarme con un email valido para poder iniciar sesion.

## Criterios de aceptacion

1. El email debe contener `@` y dominio valido (ej. `usuario@dominio.com`).
2. La contrasena debe tener al menos 8 caracteres.
3. Ante dato invalido, el sistema muestra mensaje de error claro y accionable.

## Caso de prueba (manual)

| Campo | Valor |
|---|---|
| ID | UAT-REG-001 |
| Objetivo | Validar registro exitoso con datos validos |
| Precondicion | Usuario no registrado previamente |
| Datos | email: `ana@example.com`; password: `Clave1234` |
| Pasos | 1) Abrir formulario de registro. 2) Completar email y password. 3) Enviar formulario. |
| Resultado esperado | Registro exitoso y mensaje de confirmacion; usuario habilitado para login. |
| Resultado obtenido | Aprobado (simulacion documentada; sin app real del curso). |

## Reflexion

Definir criterios de aceptacion claros reduce ambiguedad entre QA, desarrollo y negocio. El caso de prueba manual sirve como base para futura automatizacion E2E.
