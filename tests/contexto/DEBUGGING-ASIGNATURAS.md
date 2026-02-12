# Debugging: Conteo de Asignaturas en Banner

Guía para depuración si el conteo de asignaturas no funciona correctamente.

---

## 🔍 Estructura HTML Esperada

### Contenedor Principal
```html
<div id="lookupScheduleTable" class="grid-container">
  <!-- Se llena dinámicamente con tabla -->
</div>
```

### Tabla Renderizada (Dinámicamente via AJAX)
```html
<table>
  <tbody>
    <tr>
      <td class="expand footable-first-column">
        <a class="section-details-link" 
           aria-haspopup="true" 
           href="#" 
           data-endpoint="/StudentRegistrationSsb/ssb/searchResults/getSectionCatalogDetails" 
           data-attributes="202610,2085" 
           tabindex="-1">DISEÑO WEB</a>
      </td>
      <!-- Más células con datos (NRC, Horas, Tipo, etc) -->
    </tr>
    <!-- Más filas de asignaturas -->
  </tbody>
</table>
```

---

## 🎯 Selectores a Usar (en orden de prioridad)

### 1. **CSS Directo** (Más Rápido)
```typescript
const count = await page.locator('a.section-details-link').count();
// Cuenta todos los links de asignatura independientemente de estructura
```

### 2. **XPath Robusto**
```typescript
const count = await page.locator("xpath=//a[@class='section-details-link']").count();
// XPath robusto - mismo resultado que CSS pero navegando DOM
```

### 3. **Por Tabla Específica (Si existe #table1)**
```typescript
const count = await page.locator('#table1 tbody tr').count();
// Contar filas si Banner usa ID específico
```

### 4. **Por XPath Absoluto (Último Recurso)**
```typescript
const xpathAbsolute = "/html/body/main/div[2]/div/div[4]/div[5]/div[1]/div[1]/div/div[2]/div[3]/div[1]/div[1]/div/table/tbody/tr";
const count = await page.locator(`xpath=${xpathAbsolute}`).count();
// Estructura HTML exacta - cambiar si Banner actualiza DOM
```

---

## ⏳ Problema Principal: TIMING

### ❌ Sin Espera Suficiente
```typescript
await page.goto(url);
const count = await page.locator('a.section-details-link').count();
// ⚠️ FALLA: tabla aún no se ha cargado con AJAX
```

### ✅ Con Espera Correcta
```typescript
// 1. Seleccionar período (dispara AJAX para cargar tabla)
await page.locator('#lookupFilter').selectOption('202610');

// 2. Esperar network idle (AJAX completo)
await page.waitForLoadState('networkidle');

// 3. IMPORTANTE: Esperar extra para que se estabilice
await page.waitForTimeout(1500);

// 4. Esperar explícitamente elemento
await page.locator('a.section-details-link').first().waitFor({ timeout: 10000 });

// 5. Ahora contar
const count = await page.locator('a.section-details-link').count();
```

---

## 🐛 Debugging: Si Aún Retorna 0

### Paso 1: Verificar que existan elementos
```typescript
// En consola del navegador o en Playwright Inspector
await page.evaluate(() => {
  // Ver todos los links con clase section-details-link
  const links = document.querySelectorAll('a.section-details-link');
  console.log(`Total links encontrados: ${links.length}`);
  links.forEach((link, i) => {
    console.log(`${i+1}. ${link.textContent}`);
  });
});
```

### Paso 2: Verificar que la tabla existe
```typescript
await page.evaluate(() => {
  const table = document.querySelector('table');
  const tbody = document.querySelector('table tbody');
  const rows = document.querySelectorAll('table tbody tr');
  
  console.log('Tabla existe:', !!table);
  console.log('Tbody existe:', !!tbody);
  console.log('Número de filas:', rows.length);
});
```

### Paso 3: Verificar que el ID #table1 existe
```typescript
await page.evaluate(() => {
  const table1 = document.querySelector('#table1');
  console.log('Tabla #table1 existe:', !!table1);
  if (table1) {
    const rows = table1.querySelectorAll('tbody tr');
    console.log('Filas en #table1:', rows.length);
  }
});
```

### Paso 4: Ver estructura HTML completa
```typescript
// Tomar screenshot de todo
const screenshot = await page.screenshot();

// O ver el HTML renderizado
const html = await page.content();
console.log(html);

// Buscar específicamente la tabla
const tableHtml = await page.locator('#lookupScheduleTable').innerHTML();
console.log('HTML dentro #lookupScheduleTable:', tableHtml);
```

---

## 🔧 Soluciones Posibles

### Problema: Tabla vacía después de selectionar período
**Solución**: Aumentar tiempo de espera
```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(2000); // Aumentar de 1500 a 2000
```

### Problema: Banner usa estructura diferente (no #table1, no class="section-details-link")
**Solución**: Buscar estructura actual en página
```typescript
// Ejecutar en Playwright Inspector (F12)
document.body.innerHTML  // Ver todo el HTML
// O buscar qué ID/clase usa la tabla
```

### Problema: Elementos están dentro de iframe
**Solución**: Cambiar a frame
```typescript
const frame = page.frameLocator('iframe.selector');
const count = await frame.locator('a.section-details-link').count();
```

### Problema: Elementos ocultos (display:none, visibility:hidden)
**Solución**: Validar visibilidad
```typescript
const isVisible = await page.locator('a.section-details-link').first().isVisible();
console.log('Links visibles:', isVisible);
```

---

## 📝 Checklist de Validación

- [ ] Esperar `waitForLoadState('networkidle')`
- [ ] Agregar pausa extra `waitForTimeout(1500)`
- [ ] Esperar explícitamente primer elemento `waitFor({ timeout: 10000 })`
- [ ] Verificar en consola que `document.querySelectorAll('a.section-details-link').length > 0`
- [ ] Verificar que tabla esté dentro de `#lookupScheduleTable`
- [ ] Si usa #table1, verificar que ese ID existe
- [ ] Validar que período se seleccionó antes de contar
- [ ] Si todo falsa, tomar screenshot y ver HTML renderizado

---

## 🚀 Código Final Funcionando

```typescript
async countSubjectsByNrc(): Promise<number> {
  // 1. Esperar que página esté lista
  await this.page.waitForLoadState('networkidle');
  await this.page.waitForTimeout(1500);
  
  // 2. Esperar que tabla tenga datos
  try {
    await this.page.locator('a.section-details-link').first().waitFor({ timeout: 15000 });
  } catch (e) {
    // Si falla, intentar otros selectores
  }

  // 3. Contar con múltiples fallbacks
  const count = await this.page.locator('a.section-details-link').count();
  if (count > 0) return count;

  // Fallback 1: XPath
  const xpathCount = await this.page.locator("xpath=//a[@class='section-details-link']").count();
  if (xpathCount > 0) return xpathCount;

  // Fallback 2: Por tabla
  const tableCount = await this.page.locator('table tbody tr').count();
  if (tableCount > 0) return tableCount;

  // Si nada funciona, retornar 0 (y loguear en test)
  return 0;
}
```

---

**Última actualización**: 11 Feb 2026  
**Si aún tiene problemas**: Lanzar `npm run test:banner:debug` e inspeccionar en Playwright Inspector
