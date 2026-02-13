# Unified E2E Test Logging Standard

This module provides a consistent logging format for all E2E tests across the project.

## Usage

### Basic Usage

```typescript
import { createTestLogger } from '../shared/logging/log-standard';

test('Example E2E Test', async () => {
  const logger = createTestLogger('T03-A4-001', 'flujo-login-logout');

  logger.start('Iniciando flujo de login');

  // Test steps
  logger.step('Abriendo página de login', 'success');
  logger.step('Ingresando credenciales', 'success');
  logger.step('Esperando redirección', 'success');

  // On test completion
  logger.finish('PASSED');
});
```

### Advanced Usage with Custom Log Directory

```typescript
const logger = createTestLogger(
  'T02-E6-001',
  'calculadora-e2e',
  'evidencias/tema02/E6-e2e/logs'
);
```

## Features

### Console Output
- Timestamped log entries with status icons (✅, ❌, ⚠️, 🚀, ℹ️)
- Human-readable step progression
- Automatic duration tracking

### JSONL Output
- Machine-readable JSON Lines format
- One test entry per line
- Includes metadata (browser, OS, timestamps)
- Easy to parse for automation/reporting

### Test Summary
- ASCII table display of results
- Aggregated statistics (pass/fail count, total duration)
- Call `printTestSummary()` to display results

## Log Entry Structure

```typescript
interface TestLogEntry {
  testId: string;                // Unique test identifier (e.g., "T03-A4-001")
  suite: string;                 // Test suite/activity name
  startTime: string;             // ISO format timestamp
  endTime: string;               // ISO format timestamp
  duration: number;              // Total duration in milliseconds
  resultado: 'PASSED' | 'FAILED'; // Test result
  steps: StepLogEntry[];        // Individual step logs
  metadata: {
    browser?: string;
    osVersion?: string;
    navegador?: string;
  };
}

interface StepLogEntry {
  timestamp: string;             // ISO format
  step: string;                  // Step description
  status: StepStatus;            // 'start' | 'success' | 'error' | 'warning' | 'info'
  duration?: number;             // Optional step duration in ms
  message?: string;              // Optional detailed message
}
```

## Log Files

Logs are saved to JSONL format in the following location:
```
evidencias/<tema>/<actividad>/logs/<testId>-<timestamp>.jsonl
```

## Integration with Existing Tests

### Before (T03-A4 E2E)
```typescript
test('flujo login logout', async ({ page }) => {
  await page.goto(env.URL_INICIAL);
  // ... no structured logging
});
```

### After
```typescript
import { createTestLogger } from '../../../shared/logging/log-standard';

test('flujo login logout', async ({ page }) => {
  const logger = createTestLogger('T03-A4-001', 'flujo-login-logout', 
    'evidencias/tema03/A4-sistema-e2e/logs');

  logger.start();

  logger.step('Navegando a URL inicial', 'start');
  await page.goto(env.URL_INICIAL);
  logger.step('Página cargada', 'success');

  // ... more steps

  logger.finish('PASSED');
});
```

## Reporting

To generate a summary report of all E2E tests:

```typescript
import { readJsonlLogs, printTestSummary } from '../shared/logging/log-standard';

const logs = readJsonlLogs('evidencias/logs');
printTestSummary(logs);
```

## Status Icons

| Status | Icon | Meaning |
|--------|------|---------|
| start | 🚀 | Test/step started |
| success | ✅ | Step completed successfully |
| error | ❌ | Step failed or test failed |
| warning | ⚠️ | Warning occurred |
| info | ℹ️ | Informational message |

## Console Output Example

```
[10:25:47] 🚀 [T03-A4-001] Test iniciado: Flujo de login y logout
[10:25:47] ✅   → Navegando a URL inicial
[10:25:48] ✅   → Aceptando cookies
[10:25:49] ✅   → Ingresando credenciales
[10:25:50] ✅   → Presionando botón de login
[10:25:51] ✅   → Esperando redirección
[10:25:52] ✅   → Verificando dashboard visible
[10:25:53] ✅   → Presionando botón de logout
[10:25:54] ✅ Test completado exitosamente (7023ms)

📝 Log guardado en: evidencias/tema03/A4-sistema-e2e/logs/T03-A4-001-2026-02-11T10-25-47.jsonl
```
