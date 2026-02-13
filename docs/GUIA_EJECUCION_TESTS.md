# Guía de Ejecución de Tests - Modo Headed (UI Visible)

**Fecha:** Febrero 11, 2026  
**Cambios:** Todos los tests de Playwright están configurados para ejecutarse en modo **headed** (navegador visible) por default

## Resumen de Cambios

### Configuración
- **playwright.config.ts**: Añadido `headed: true` y `slowMo: 500ms` para visualización clara
- **playwright.banner.config.ts**: Añadido `headed: true` (mantiene `slowMo: 1500ms` para Banner)
- **package.json**: Nuevos comandos de test con ejecución secuencial

### Beneficios
✅ **Ver el navegador ejecutando cada test en tiempo real**  
✅ **slowMo ralentiza acciones para seguimiento visual**  
✅ **Ejecución secuencial (no paralela) para mejor observación**  
✅ **Videos y screenshots automáticos de fallos**

---

## Comandos de Test Principales

### 📚 Tema 02 - Laboratorio Unidad II (ISO-410)

```bash
# Pruebas Unitarias (math-utils)
npm run test:unit

# Pruebas de Integración (auth service)
npm run test:integration

# Test E2E (calculadora)
npm run test:tema02:e2e
# ↑ Ejecuta en modo HEADED (UI visible)

# Versión headless (sin UI) - para CI/CD
npm run test:tema02:e2e:headless
```

**Qué ejecuta:**
- `test:unit` → `tests/lab-tema02/unit/math-utils.spec.ts` (suma, división, factorial)
- `test:integration` → `tests/lab-tema02/integration/auth.spec.ts` (integración servicio + repo)
- `test:tema02:e2e` → `tests/lab-tema02/e2e/calculadora.e2e.spec.ts` (E2E calculadora local)

---

### 🔧 Tema 03 - Laboratorio Unidad III (ISO-410)

```bash
# Pruebas Unitarias (descuentos)
npm run test:tema03:unit

# Pruebas de Integración (API mock)
npm run test:tema03:integration

# Test E2E (login → acción → logout)
npm run test:tema03:e2e
# ↑ Ejecuta en modo HEADED (UI visible)

# Versión headless (sin UI) - para CI/CD
npm run test:tema03:e2e:headless

# Test de Rendimiento (k6)
npm run test:tema03:perf
```

**Qué ejecuta:**
- `test:tema03:unit` → `tests/lab-tema03/unit/descuentos.spec.ts` (cálculo de descuentos)
- `test:tema03:integration` → `tests/lab-tema03/integration/api-mock.spec.ts` (API REST mock)
- `test:tema03:e2e` → `tests/lab-tema03/e2e/flujo-login-accion-logout.spec.ts` (UI login/logout)
- `test:tema03:perf` → `tests/lab-tema03/performance/saldo-load.k6.js` (carga k6)

---

### 🏦 Banner System (Bonus - Test Real)

```bash
# Test E2E Banner (login OAuth → consulta horario → logout)
npm run test:banner
# ↑ Ejecuta en modo HEADED (UI visible)
#   + slowMo: 1500ms (muy lento para demostración detallada)
#   + Captura videos y screenshots

# Versión headless
npm run test:banner:headless

# Debug interactivo
npm run test:banner:debug

# UI interactivo (en carpeta)
npm run test:banner:ui
```

---

### 🎯 Ejecutar TODO en Modo Headed

```bash
# Todos los tests E2E juntos (Tema02, Tema03, Banner)
npm run test:e2e:all

# Resultado esperado:
# ✅ Calculadora E2E (Tema02)
# ✅ Login/Logout E2E (Tema03)
# ✅ Banner E2E (Sistema real)
```

---

## Flujo de Ejecución Esperado

### Test Tema02 - Calculadora E2E
```
🚀 Iniciando: npm run test:tema02:e2e

1. 📄 Abre browser Edge
2. 📂 Carga archivo local: web/calculadora.html
3. ⌨️ Ingresa valores: 2 + 3
4. 🖱️ Presiona botón "Sumar"
5. ✅ Valida resultado: 5
6. 📸 Captura screenshot
7. 🎥 Guarda video (si falla)
8. 📝 Genera JSONL log → evidencias/tema02/E6-e2e/logs/

Duración: ~5 segundos (con slowMo)
```

### Test Tema03 - Login/Logout E2E
```
🚀 Iniciando: npm run test:tema03:e2e

1. 📄 Abre browser Edge
2. 🔑 Carga archivo: web/tema03-demo/index.html
3. ⌨️ Ingresa credenciales de test
4. 🖱️ Presiona Login
5. ✅ Valida estado autenticado
6. 🎬 Ejecuta acción de negocio
7. ✅ Valida estado acción
8. 🚪 Presiona Logout
9. ✅ Valida sesión cerrada
10. 📸 Captura screenshot
11. 📝 Genera JSONL log → evidencias/tema03/A4-sistema-e2e/logs/

Duración: ~10 segundos (con slowMo)
```

### Test Banner - Sistema Real
```
🚀 Iniciando: npm run test:banner

1. 📄 Abre browser Edge
2. 🔐 Navega a Banner UNAPEC (producción)
3. 🔑 OAuth Microsoft: ingresa credenciales
4. ✅ Autentica exitosamente
5. 📅 Navega a sección "Consultar Horario"
6. 🔍 Selecciona período académico
7. 📊 Carga tabla de asignaturas por AJAX
8. 📝 Cuenta asignaturas inscritas (6-level fallback strategy)
9. ✅ Valida asignaturas visibles
10. 🚪 Presiona Logout
11. ✅ Valida sesión cerrada
12. 📸 Captura screenshot
13. 🎥 Guarda video completo
14. 📝 Genera JSONL log → evidencias/banner/logs/

Duración: ~60 segundos (con slowMo: 1500ms)
Nota: Con slowMo=1500ms puedes ver cada acción claramente

⚠️ Req: Variables de entorno (.env) con credenciales Banner activas
```

---

## Configuración por Defecto

### Playwright Config Settings

**En todos los tests (Tema02, Tema03):**
```javascript
headed: true              // ✅ Navegador visible
slowMo: 500              // Ralentiza 500ms cada acción
fullyParallel: false     // ❌ NO paralelo (secuencial)
workers: 1               // Un worker a la vez
timeout: 30_000          // Timeout 30 segundos
```

**Banner (especial):**
```javascript
headed: true              // ✅ Navegador visible
slowMo: 1500             // Ralentiza 1500ms cada acción (MÁS LENTO para demo)
fullyParallel: false     // ❌ NO paralelo
workers: 1               // Un worker
timeout: 120_000         // Timeout 120 segundos (OAuth es lento)
video: 'on'              // Graba TODO (no solo fallos)
```

---

## Cambiar Comportamiento (Opcional)

### Si necesitas headless (sin UI) en desarrollo:

```bash
# Opción 1: Usar comando headless directo
npm run test:tema02:e2e:headless
npm run test:tema03:e2e:headless

# Opción 2: Editar playwright.config.ts y cambiar:
# headed: false        // Cambiar a false
# fullyParallel: true  // Cambiar a true si quieres paralelismo
```

### Si necesitas más lento (más visible):

```bash
# Editar playwright.config.ts:
slowMo: 1000  // Cambiar de 500 a 1000ms
```

### Si necesitas más rápido:

```bash
# Editar playwright.config.ts:
slowMo: 200   // Cambiar de 500 a 200ms
```

---

## Solucionar Problemas

### ❌ "Error: browser not found"
**Solución:** Instala navegadores Playwright
```bash
npx playwright install
```

### ⏳ "Test timeout"
**Solución:** Aumenta timeout en playwright.config.ts
```javascript
timeout: 60_000  // De 30_000 a 60_000
```

### 🔒 "EAUTH - Credenciales inválidas (Banner)"
**Solución:** Verifica `.env` con credenciales actualizadas
```bash
cat .env
# Debe tener: BANNER_USERNAME, BANNER_PASSWORD, etc.
```

### 📹 "No se grabó video"
**Solución:** Video se graba solo en fallos (config default)
```javascript
video: 'on'  // Cambiar a 'on' para grabar TODO
```

---

## Mapeo: Tests ↔ Actividades PDF

| PDF | Actividad | Test | Comando |
|-----|-----------|------|---------|
| Lab-Tema02 | E1 | Documental | N/A |
| Lab-Tema02 | E2 | Documental | N/A |
| Lab-Tema02 | E3A | `math-utils.spec.ts` | `npm run test:unit` |
| Lab-Tema02 | E3B | `auth.spec.ts` | `npm run test:integration` |
| Lab-Tema02 | E4 | Documental | N/A |
| Lab-Tema02 | E5 | Documental | N/A |
| Lab-Tema02 | E6 | `calculadora.e2e.spec.ts` | `npm run test:tema02:e2e` |
| Lab-Tema03 | A1 | Documental | N/A |
| Lab-Tema03 | A2 | `descuentos.spec.ts` | `npm run test:tema03:unit` |
| Lab-Tema03 | A3 | `api-mock.spec.ts` | `npm run test:tema03:integration` |
| Lab-Tema03 | A4 | `flujo-login-accion-logout.spec.ts` | `npm run test:tema03:e2e` |
| Lab-Tema03 | A5 | `saldo-load.k6.js` | `npm run test:tema03:perf` |
| Lab-Tema03 | A6 | Documental | N/A |
| Banner | Bonus | `login-consulta-horario-logout.spec.ts` | `npm run test:banner` |

---

## Evidencias Generadas

Después de ejecutar tests, encontrarás:

```
evidencias/
├── tema02/
│   ├── E6-e2e/
│   │   ├── logs/          ← JSONL test logs
│   │   └── screenshots/   ← PNG de pruebas
│   └── ...
├── tema03/
│   ├── A4-sistema-e2e/
│   │   ├── logs/          ← JSONL test logs
│   │   ├── screenshots/   ← PNG de pruebas
│   │   └── videos/        ← MP4 (si falla)
│   ├── A5-rendimiento/
│   │   └── resultados/    ← Métricas k6
│   └── ...
└── banner/
    ├── logs/              ← JSONL test logs
    ├── screenshots/       ← PNG de pruebas
    └── videos/            ← MP4 completos
```

---

**Última actualización:** Febrero 11, 2026  
**Estado:** ✅ Todos los tests configurados para modo headed
