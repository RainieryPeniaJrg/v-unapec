## Instrucciones para Ejecutar Tests con Codex

El repositorio está completamente configurado para ejecutar pruebas E2E con Playwright + TypeScript.

### Configuración Inicial

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/RainieryPeniaJrg/v-unapec.git
   cd v-unapec
   ```

2. **Instalar dependencias:**
   ```bash
   npm ci
   ```

3. **Instalar navegadores:**
   ```bash
   npx playwright install
   ```

4. **Definir variable de entorno (BASE_URL):**
   ```bash
   # PowerShell
   $env:BASE_URL="http://tu-aplicacion:puerto"

   # Bash/Linux/Mac
   export BASE_URL="http://tu-aplicacion:puerto"
   ```

### Comandos para Ejecutar Tests

#### Ejecutar Todos los Tests
```bash
npm test
```

#### Ejecutar Por Tema
```bash
# Solo Tema 02
npm run test:tema02

# Solo Tema 03
npm run test:tema03
```

#### Modo Interactivo
```bash
# Con interfaz UI
npm run test:ui

# Con modo debug
npm run test:debug

# Con navegadores visibles
npm run test:headed
```

#### Ver Reporte
```bash
npm run report
```

### Estructura de Tests

- `tests/contexto/tema02/` - Tests del Laboratorio Tema 02 (ISO 4.1.0)
- `tests/contexto/tema03/` - Tests del Laboratorio Tema 03 (ISO 4.1.0)
- `tests/contexto/shared/` - Tipos e interfaces compartidas

### Archivos de Configuración

- `playwright.config.ts` - Configuración de Playwright (navegadores, reportes)
- `tsconfig.json` - Configuración de TypeScript
- `.env.example` - Template para variables de entorno
- `.github/workflows/playwright.yml` - CI/CD con GitHub Actions

### Nota Importante

Las pruebas están estructuradas con cases templates. Cada `test.step()` debe implementar las acciones según los PDFs en la carpeta `/Contexto`.

### Git Setup
- **Email:** rainierypenajrg@gmail.com
- **URL Repositorio:** https://github.com/RainieryPeniaJrg/v-unapec
- **Rama Principal:** main
