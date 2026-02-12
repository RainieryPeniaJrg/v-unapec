# Explicación: Test Banner E2E (BANNER-E2E-001)

Documento educativo para entender cómo funciona el test automatizado de autenticación y consulta de horario en Banner Student Information System de UNAPEC.

---

## 📋 Resumen del Test

**Objetivo**: Automatizar el flujo completo de un estudiante autenticándose en Banner y consultando su horario de clase.

**Flujo Principal**:
```
1. Validar credenciales del entorno (.env)
2. Acceder a landing.unapec.edu.do/banner/
3. Hacer click en "Acceso para estudiantes"
4. Autenticarse con OAuth Microsoft (email + password)
5. Navegar a consultar horario
6. Seleccionar período (ej: ENE-ABR 2026)
7. Contar asignaturas registradas
8. Capturar evidencia (screenshots)
9. Cerrar sesión (logout)
```

---

## 🔐 Arquitectura: Page Object Model (POM)

El test está organizado en **3 Page Objects** (clases que representan páginas/funcionalidades):

### 1. **BannerLoginPage** (`pages/banner-login.page.ts`)

Gestiona todo el flujo de login:

```typescript
// Navega a landing
await loginPage.gotoLanding();

// Abre portal de estudiantes (sigue enlaces dinámicamente)
await loginPage.openBannerPortal();

// Maneja OAuth Microsoft:
// - Input email (#i0116)
// - Input password (#i0118)
// - Botón "Sign in"
// - Pantalla "Stay signed in?" (click Yes/No)
// - Detecta y maneja errores
await loginPage.login(username, password);
```

**¿Por qué es complejo?**
- OAuth Microsoft tiene múltiples pantallas
- Los selectores varían según contexto (`#i0116` vs `input[name="loginfmt"]`)
- Requiere esperar eventos dinámicos (cambios de pantalla, redirects)

---

### 2. **BannerHomePage** (`pages/banner-home.page.ts`)

Representa la página principal después de login exitoso:

```typescript
// Valida que el usuario está autenticado (busca #registerLink, menús, etc)
await homePage.assertAuthenticated();

// Obtiene nombre mostrado del usuario en la interfaz
const displayName = await homePage.getDisplayName();

// Navega a ver horario de clase
await homePage.gotoClassSchedule();

// Cerrar sesión (busca "Logout" / "Salir" con múltiples estrategias)
await homePage.logout();

// Valida que se cerró sesión (URL cambió, login visible, etc)
await homePage.assertLoggedOut();
```

**Puntos clave**:
- Múltiples estrategias de búsqueda (fallback)
- Maneja dinámicas de interfaz (cambios en Banner)

---

### 3. **BannerSchedulePage** (`pages/banner-schedule.page.ts`) - ⭐ LA MÁS IMPORTANTE

Gestiona la página de consulta de horario y el **conteo de asignaturas**:

```typescript
// Selecciona período académico (ej: 202610 = ENE-ABR 2026)
const periodSelection = await schedulePage.selectTargetPeriod();
// Retorna: { selectedValue: '202610', selectedLabel: 'ENE-ABR 2026 GRADO', usedFallback: false }

// Valida que el horario es visible en pantalla
await schedulePage.assertScheduleVisible();

// Scroll en contenedores para cargar todos los elementos
await schedulePage.ensureSchedulePanelsVisibleAndScrolled();

// ⭐⭐⭐ CONTEO DE ASIGNATURAS (3 estrategias):
const count = await schedulePage.countSubjectsByNrc();
// Intento 1: XPath robustísimo: //a[@class='section-details-link']
// Intento 2: CSS selectors (.slick-row, .listViewItem, etc)
// Intento 3: JavaScript evaluation (busca divs con texto "NRC")

// Captura screenshot de horario
const evidence = await schedulePage.captureScheduleEvidence();
// { wrapperPath: 'evidencias/banner/screenshots/lookup-wrapper-...png', ... }
```

---

## 🎯 Punto Crítico: Conteo de Asignaturas

### El Problema
Banner usa una estructura HTML dinámica que se **carga via AJAX después de seleccionar período**:
- La tabla NO está en el HTML inicial
- Se carga dinámicamente cuando el usuario selecciona periodo (202610, etc)
- Los selectores CSS/XPath son correctos, pero **necesitan esperas explícitas**

### La Solución: Esperar + Múltiples Selectores

#### **Paso 1: Esperar a que la tabla se cargue**
```typescript
// Después de seleccionar período
await this.page.waitForLoadState('networkidle'); // AJAX completado
await this.page.waitForTimeout(1500); // Pausa extra para estabilización
await this.page.locator('a.section-details-link').first().waitFor({ timeout: 15000 }); // Primer elemento presente
```

#### **Paso 2: Contar usando CSS directo (Más rápido)**
```typescript
// HTML esperado: <a class="section-details-link">DISEÑO WEB</a>
const count = await page.locator('a.section-details-link').count();
// Retorna: 1, 2, 3, ... N asignaturas
```

#### **Paso 3: Fallbacks si CSS falla**
```typescript
// Intento 1: XPath robusto
const xpathCount = await page.locator("xpath=//a[@class='section-details-link']").count();
if (xpathCount > 0) return xpathCount;

// Intento 2: Contar por tabla
const tableCount = await page.locator('table tbody tr').count();
if (tableCount > 0) return tableCount;

// Intento 3: Búsqueda por ID #table1 (si existe)
const table1Count = await page.locator('#table1 tbody tr').count();
if (table1Count > 0) return table1Count;

// Intento 4: JavaScript evaluation final
const jsCount = await page.evaluate(() => {
  // Buscar en scopes específicos
  const links = document.querySelectorAll('a.section-details-link');
  return links.length;
});
```

### El HTML Real (Después de AJAX)
```html
<!-- El contenedor principal -->
<div id="lookupScheduleTable" class="grid-container">
  <!-- Se carga dinámicamente una tabla -->
  <table>
    <tbody>
      <tr>
        <td>
          <a class="section-details-link" 
             data-endpoint="/StudentRegistrationSsb/ssb/searchResults/getSectionCatalogDetails" 
             data-attributes="202610,2085">
            DISEÑO WEB
          </a>
        </td>
        <!-- Más datos de la asignatura -->
      </tr>
      <!-- Más asignaturas -->
    </tbody>
  </table>
</div>
```

### ⭐ Lo Crítico
1. **NO contar antes de esperar**: El conteo retornará 0 si tabla no se ha cargado
2. **Usar CSS `.section-details-link` primero**: Es más rápido que XPath
3. **Tener fallbacks**: Si Banner cambia estructura, al menos uno funcionará
4. **Loguear cuál selector funcionó**: Para debugging futuro

### Debugging Si Retorna 0
Ver archivo: `DEBUGGING-ASIGNATURAS.md` (en esta carpeta)

---

## 📊 Flujo de Logging y Evidencias

### Logs Detallados en Consola
```
▶ BANNER-E2E-001: Login → Consulta Horario → Logout
👤 Usuario: j.pena171@unapec.edu.do
🌐 Navegador: edge-banner
⏱️  Inicio: 10:25:47

[10:25:47] ▶ Validando credenciales del entorno
[10:25:47] ✅ Credenciales validadas
[10:25:49] ▶ Navegando a landing.unapec.edu.do/banner/
[10:25:50] ✅ Landing cargada
[10:25:50] ▶ Buscando botón "Acceso para estudiantes"
[10:25:52] ✅ Portal Banner abierto
... (más pasos)
[10:26:15] ✅ Asignaturas contadas: 7
[10:26:18] ✅ Sesión cerrada confirmada ✅

╔══════════════════════════════════════════════════════════════╗
║             RESUMEN DE EJECUCION - BANNER E2E               ║
╠══════════════════════════════════════════════════════════════╣
║ Usuario              │ j.pena171@unapec.edu.do              ║
║ Nombre mostrado      │ JHON D. PENA GRIEGO                  ║
║ Asignaturas contadas │ 7                                    ║
║ Periodo              │ 202610                               ║
║ Etiqueta periodo     │ ENE-ABR 2026 GRADO                   ║
║ Duracion (segundos)  │ 32.45                                ║
║ Navegador            │ edge-banner                          ║
║ Estado               │ ✅ EXITOSO                           ║
╚══════════════════════════════════════════════════════════════╝
```

### Archivos Generados
```
evidencias/banner/logs/banner-runs.jsonl
  → Registro JSONL con timestamp, usuario, asignaturas, período, duración, etc

evidencias/banner/screenshots/
  ├── post-login-20260211-101547.png          (después de autenticación)
  ├── lookup-wrapper-20260211-101552.png      (contenedor de horario)
  ├── schedule-calendar-20260211-101553.png   (calendario de asignaturas)
  └── post-logout-20260211-101558.png         (después de logout)

test-results/banner/
  └── [html report, videos, traces]
```

---

## ⏱️ Ralentización (slowMo)

En `playwright.banner.config.ts`:
```typescript
use: {
  slowMo: 1500, // Cada acción Playwright espera 1.5 segundos extra
}
```

**Propósito**: Permite seguir visualmente cada paso del test durante demostración educativa.

**Uso**:
```bash
npm run test:banner:headed    # Con slowMo = 1500ms (1.5s cada acción)
```

Verás:
1. Página carda lentamente
2. Clicks son claros y visibles
3. Puedes leer qué está pasando en tiempo real
4. Excelente para explicar automatización a no-técnicos

---

## 🛠️ Manejo de Errores y Resiliencia

El test captura **errores en 3 niveles**:

### Nivel 1: Errores en assertions
```typescript
await homePage.assertAuthenticated();  // Si falla, throw Error
  // Causa: Login falló, página no cargó, session expiró, etc
```

### Nivel 2: Errores en navegación
```typescript
await page.goto(url, { waitUntil: 'domcontentloaded' });
  // Causa: URL no disponible, timeout red, banner caído, etc
```

### Nivel 3: Errores de datos
```typescript
const count = await schedulePage.countSubjectsByNrc();
if (count === 0) {
  // Posible: usuario sin cursos, período vacío, selectores rotos
}
```

**Todas las excepciones**:
1. Se capturan en `catch`
2. Se registran en `banner-runs.jsonl` con `status: 'failed'`
3. Se imprimen en consola con tabla resumen
4. Se re-lanzan para fallar el test

---

## 📚 Referencias Útiles

- **Selectors**: Centralizados en `tests/contexto/fixtures/banner-selectors.ts`
  - CSS, XPath, atributos data-*
  - Fácil encontrar y actualizar si Banner cambia

- **Test Data**: `tests/contexto/fixtures/banner-test-data.ts`
  - Credenciales, períodos, URLs, timeouts
  - Un único lugar para actualizar datos

- **Logging**: `tests/banner/e2e/utils/banner-log.ts`
  - Métodos `logDetailedConsole()`, `logTableSummary()`
  - Registro en JSONL + stdout

---

## ✅ Checklist de Validación

Después de ejecutar `npm run test:banner`:

- [ ] Consola muestra logs detallados (▶, ✅, ❌) para cada paso
- [ ] Tabla resumen impresa al final con todos los datos
- [ ] Archivo `evidencias/banner/logs/banner-runs.jsonl` contiene entrada
- [ ] Screenshots salvados en `evidencias/banner/screenshots/`
- [ ] Si fallo, archivo tiene `status: 'failed'` + mensaje de error
- [ ] Cada acción es claramente observable visualmente (slowMo)

---

## 🎓 Conceptos de QA Aplicados

Este test demuestra:

1. **Verificación vs Validación**
   - ✅ Verificamos estructura (selectores, elementos)
   - ✅ Validamos lógica (login, horario cargado, asignaturas contadas)

2. **Automatización Multi-Nivel**
   - 🎯 UI: clicks, rellenado de formularios, navegación
   - 🎯 API: espera de red, estado DOM, eventos

3. **Resiliencia y Fallbacks**
   - 🛡️ 3 estrategias para conteo (XPath → CSS → JS)
   - 🛡️ Múltiples selectores por elemento (si uno falla, intenta otro)

4. **Trazabilidad**
   - 📝 Logs detallados en consola + JSONL
   - 📸 Screenshots de cada estado crítico
   - ⏱️ Timestamps y duración

5. **Mantenibilidad**
   - 📦 Page Objects (lógica separada de estructura)
   - 🎯 Selectores centralizados (fácil actualizar)
   - 📚 Documentación integrada (comentarios en código)

---

## 📞 Preguntas Comunes

**P: ¿Qué pasa si el período no existe?**
R: `selectTargetPeriod()` retorna `usedFallback: true` y selecciona período actual.

**P: ¿Y si no hay asignaturas para ese período?**
R: `countSubjectsByNrc()` retorna 0, se registra en log, test sigue (no invalida).

**P: ¿Cuánto tiempo toma ejecutar?**
R: ~30-40 segundos en Edge real (incluye OAuth Microsoft). Con slowMo: 45-60 segundos.

**P: ¿Por qué 3 estrategias de conteo?**
R: Banner es dinámico. 3 fallbacks garantizan que funcionará aunque cambien selectores.

**P: ¿Puedo usarlo en CI?**
R: Sí, se ejecuta en GitHub Actions. Requiere vars de entorno reales (credenciales).

---

**Última actualización**: 11 Feb 2026  
**Autor**: Test Banner E2E - ISO410 UNAPEC
