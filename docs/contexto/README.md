# Contexto - Documentación del Proyecto ISO-410 UNAPEC

Este directorio centraliza la documentación de referencia y contexto del proyecto V UNAPEC para las asignaturas ISO-410-2 "Verificación y Validación" e ISO-410-3 "Testing Avanzado".

---

## 📚 Estructura de Carpetas

```
V UNAPEC/
├── docs/
│   ├── contexto/                    ← Tú estás aquí
│   │   ├── README.md                (este archivo)
│   │   ├── Lab-Tema02-ISO410.pdf    (materiales laboratorio Tema 02)
│   │   ├── Lab-Tema03-ISO410.pdf    (materiales laboratorio Tema 03)
│   │   └── referencias/             (artículos, estándares, links útiles)
│   ├── lab-tema02/                  (respuestas/documentos del Tema 02)
│   ├── lab-tema03/                  (respuestas/documentos del Tema 03)
│   └── banner/                      (guías de ejecución Banner)
│
├── tests/contexto/                  ← Fixtures y explicaciones técnicas
│   ├── fixtures/
│   │   ├── banner-test-data.ts      (datos de prueba centralizados)
│   │   └── banner-selectors.ts      (selectores CSS/XPath centralizados)
│   └── test-explanations.md         (guía educativa del test Banner E2E)
│
├── src/                             (implementaciones TypeScript)
└── ...
```

---

## 📖 Materiales de Referencia

### Laboratorio Tema 02 - Verificación vs Validación
- **Archivo**: `Lab-Tema02-ISO410.pdf` (en esta carpeta)
- **Contenido**:
  - Ejercicio 1: Diferencia verificación vs validación
  - Ejercicio 2: Inspección y walkthrough de código
  - Ejercicio 3: Pruebas unitarias e integración
  - Ejercicio 4: UAT (User Acceptance Testing)
  - Ejercicio 5: Métodos formales (lógica booleana)
  - Ejercicio 6: Matriz de trazabilidad

**Respuestas/Documentos**: Ver [`docs/lab-tema02/`](../lab-tema02/)

### Laboratorio Tema 03 - Testing Avanzado
- **Archivo**: `Lab-Tema03-ISO410.pdf` (en esta carpeta)
- **Contenido**:
  - Actividad 1: Partición de equivalencias y valores límite
  - Actividad 2: Pruebas unitarias con casos parametrizados
  - Actividad 3: Integración API (equivalente Postman con Playwright mock)
  - Actividad 4: Sistema E2E (flujo completo login → acción → logout)
  - Actividad 5: Rendimiento y carga (k6)
  - Actividad 6: Trazabilidad y reporte de defectos

**Respuestas/Documentos**: Ver [`docs/lab-tema03/`](../lab-tema03/)

### Sistema Real Banner
- **Archivo**: [`docs/banner/README-ejecucion.md`](../banner/README-ejecucion.md)
- **Contenido**:
  - Setup y credenciales
  - Ejecución de test Banner E2E
  - Interpretación de logs y evidencias
  - Troubleshooting

**Explicación técnica**: Ver [`tests/contexto/test-explanations.md`](../../tests/contexto/test-explanations.md)

---

## 🛠️ Fixtures y Datos de Prueba

Para centralizar y facilitar mantenimiento de datos de prueba:

### `tests/contexto/fixtures/banner-test-data.ts`
Provides centralized test data:
```typescript
import { BANNER_PERIODS, VALID_CREDENTIALS } from '../../contexto/fixtures/banner-test-data';

const period = BANNER_PERIODS.ENERO_ABRIL_2026;        // { value: '202610', label: 'ENE-ABR 2026 GRADO', ... }
const { username, password } = VALID_CREDENTIALS.primary;  // UNAPEC credentials
```

### `tests/contexto/fixtures/banner-selectors.ts`
Centralized selectors for maintainability:
```typescript
import { SELECTORS, XPATHS } from '../../contexto/fixtures/banner-selectors';

// CSS selector: a.section-details-link
const count = await page.locator(SELECTORS.schedule.subjectLinkCSS).count();

// XPath: //a[@class='section-details-link']
const count = await page.locator(`xpath=${XPATHS.subjectByLink}`).count();
```

---

## 📝 Documentación Técnica

### Test Banner E2E (BANNER-E2E-001)
**Ubicación**: [`tests/contexto/test-explanations.md`](../../tests/contexto/test-explanations.md)

**Cubre**:
- Arquitectura Page Object Model (POM)
- Flujo de autenticación OAuth Microsoft
- Estrategias de conteo de asignaturas (3 niveles fallback)
- Logging y evidencias (screenshots + JSONL)
- Manejo de errores y resiliencia
- Ralentización (slowMo) para demostración

---

## 🚀 Cómo Usar Este Contexto

### Para QA/Testing
1. Lee [`Lab-Tema03-ISO410.pdf`](./Lab-Tema03-ISO410.pdf) para fundamentos
2. Lee [`tests/contexto/test-explanations.md`](../../tests/contexto/test-explanations.md) para implementación
3. Usado `fixtures/banner-selectors.ts` para actualizar selectores si Banner cambia
4. Ejecuta `npm run test:banner` para demos

### Para Desarrolladores
1. Revisa `fixtures/banner-test-data.ts` para datos y timeouts
2. Revisa `fixtures/banner-selectors.ts` para selectores CSS/XPath
3. Si necesitas agregar selectores nuevos:
   - Actualiza `fixtures/banner-selectors.ts` en una línea
   - Todos los tests lo usan automáticamente

### Para Instructores/Presentadores
1. Lee [Lab-Tema02-ISO410.pdf](./Lab-Tema02-ISO410.pdf) + [Lab-Tema03-ISO410.pdf](./Lab-Tema03-ISO410.pdf)
2. Tea: [`tests/contexto/test-explanations.md`](../../tests/contexto/test-explanations.md)
3. Ejecuta:
   ```bash
   npm run test:banner:headed    # Con slowMo = 1500ms (visible)
   ```
4. Lee logs en consola (pasos detallados + tabla resumen)
5. Revisa evidencias en `evidencias/banner/screenshots/`

---

## 📊 Matriz de Trazabilidad General

| Requisito | Lab | Test | Documentación |
|-----------|-----|------|----------------|
| Diferencia verificación vs validación | Tema02 | N/A | `Lab-Tema02-ISO410.pdf` |
| Inspección y walkthrough de código | Tema02 | N/A | `docs/lab-tema02/ejercicio2-inspeccion-walkthrough.md` |
| Pruebas unitarias e integración | Tema02 | ✅ `tests/lab-tema02/unit/` y `tests/lab-tema02/integration/` | `docs/lab-tema02/matriz-trazabilidad.md` |
| Partición de equivalencias y límites | Tema03 | ✅ `tests/lab-tema03/unit/` | `docs/lab-tema03/actividad1-equivalencias-limites.md` |
| API mock (Postman equivalente) | Tema03 | ✅ `tests/lab-tema03/integration/` | `docs/lab-tema03/actividad3-postman-equivalente.md` |
| **Sistema E2E Login→Horario→Logout** | **Tema03** | ✅ **`tests/banner/e2e/`** | **`tests/contexto/test-explanations.md`** |
| Rendimiento y carga | Tema03 | ⏳ `tests/lab-tema03/performance/saldo-load.k6.js` | `docs/lab-tema03/matriz-trazabilidad.md` |
| Reporte de defectos | Tema03 | 📝 Ejemplo incluido | `docs/lab-tema03/reporte-defecto-ejemplo.md` |

---

## 🔧 Configuración y Scripts

### Ejecutar Tests
```bash
# Tests generales (Tema02 + Tema03)
npm test

# Test Banner E2E (real, headless)
npm run test:banner

# Test Banner E2E (visible en Edge, con slowMo)
npm run test:banner:headed

# Test Banner E2E (modo debug interactivo)
npm run test:banner:debug
```

### Visualizar Reportes
```bash
# Reporte HTML Playwright (tests generales)
npm run report

# Reporte HTML Banner (test real)
npm run test:banner:report
```

---

## 📋 Estándares y Normas de Referencia

Este proyecto se basa en:

- **ISO 9000:2015** - Fundamentos de gestión de calidad
- **ISO 9001:2015** - Sistemas de gestión de calidad
- **ISO/IEC/IEEE 29119** - Software testing standard
- **ISTQB Certification** - Software Testing Best Practices
- **IEEE 829** - Software and System Test Documentation

---

## 📞 Referencias Útiles

### Selectores Playwright
- [Playwright Locators](https://playwright.dev/docs/locators)
- [XPath Tutorial](https://www.w3schools.com/xml/xpath_intro.asp)
- [CSS Selectors](https://www.w3schools.com/cssref/selectors_intro.asp)

### Testing
- [Playwright Documentation](https://playwright.dev)
- [Test Automation Best Practices](https://www.selenium.dev/documentation/)

### OAuth Microsoft
- [Microsoft Learn - OAuth 2.0](https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
- [Azure AD Testing](https://learn.microsoft.com/en-us/azure/active-directory/develop/test-automate-sign-in)

---

## ✅ Checklist de Validación

Después de leer esta documentación:

- [ ] Entiendo diferencia entre verificación y validación
- [ ] Conozco estructura de tests (unitarias, integración, E2E)
- [ ] Puedo ejecutar tests y leer los logs
- [ ] Puedo interpretar la tabla resumen de consola
- [ ] Conozco dónde buscar selectores si Banner cambia
- [ ] Sé dónde actualizar datos de prueba (fixtures)
- [ ] Entiendo flujo OAuth Microsoft en test Banner
- [ ] Puedo explicar 3 estrategias de conteo de asignaturas

---

**Última actualización**: 11 Feb 2026  
**Versión**: 1.0  
**Mantener actualizado**: Sí - Especialmente `fixtures/banner-selectors.ts` si Banner cambia
