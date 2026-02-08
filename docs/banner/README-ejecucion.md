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

## Variables de entorno requeridas

```powershell
$env:BANNER_USERNAME="tu_usuario@unapec.edu.do"
$env:BANNER_PASSWORD="tu_password"
$env:BANNER_RUN_NEGATIVE="false"
$env:BANNER_RUN_RESILIENCE="false"
```

## Comandos recomendados

```powershell
npx playwright install msedge
npm run test:banner:headed
npm run test:banner:report
```

## Notas de seguridad

- No guardar credenciales en código.
- No ejecutar en CI con cuenta real.
- Mantener `workers=1` para reducir bloqueos por intentos múltiples.
