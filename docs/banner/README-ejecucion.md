# Banner E2E - Guia de ejecucion local

## Objetivo

Automatizar en Edge el flujo real:

1. Login en Banner UNAPEC.
2. Consulta de horario de clase.
3. Logout.

Incluye evidencias automáticas:

- screenshots en `evidencias/banner/screenshots/`
- log JSONL en `evidencias/banner/logs/banner-runs.jsonl`
- reporte HTML en `playwright-report-banner/`
- período objetivo `ENE-ABR 2026 GRADO` (`202610`) con fallback al período disponible
- cantidad de asignaturas calculada por `NRC` único (deduplicado)

## Archivo .env requerido (carga automatica)

```powershell
# crear .env en la raiz del proyecto con:
BANNER_USERNAME=tu_usuario@unapec.edu.do
BANNER_PASSWORD=tu_password
BANNER_RUN_NEGATIVE=false
BANNER_RUN_RESILIENCE=false
```

## Comandos recomendados

```powershell
npx playwright install msedge
npm run test:banner:headed
```

Luego:

```powershell
npm run test:banner:report
```

## Notas de seguridad

- No guardar credenciales en código.
- No ejecutar en CI con cuenta real.
- Mantener `workers=1` para reducir bloqueos por intentos múltiples.

## Política de período y conteo

- El test intenta seleccionar `202610` (`ENE-ABR 2026 GRADO`) en `#lookupFilter`.
- Si no existe, usa el período actual y registra `usedFallbackPeriod=true` en el JSONL.
- `subjectsCount` se calcula por NRC único en el horario (deduplicado por `Set`).

## Evidencias de horario

- `evidencias/banner/screenshots/*lookup-wrapper*.png`
- `evidencias/banner/screenshots/*schedule-calendar*.png`

## Ejemplo JSONL

```json
{
  "timestamp": "2026-02-08T22:10:00.000Z",
  "site": "https://landing.unapec.edu.do/banner/",
  "username": "usuario@unapec.edu.do",
  "displayName": "NOMBRE APELLIDO",
  "subjectsCount": 6,
  "periodValue": "202610",
  "periodLabel": "ENE-ABR 2026 GRADO",
  "usedFallbackPeriod": false,
  "scheduleScreenshots": {
    "wrapperPath": "C:/.../evidencias/banner/screenshots/lookup-wrapper-20260208-221000.png",
    "calendarPath": "C:/.../evidencias/banner/screenshots/schedule-calendar-20260208-221000.png"
  },
  "scheduleScreenshotPath": "C:/.../evidencias/banner/screenshots/lookup-wrapper-20260208-221000.png",
  "status": "passed"
}
```
