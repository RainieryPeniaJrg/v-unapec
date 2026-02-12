import { appendE2ELog, buildE2EScreenshotPath } from '../../../shared/e2e-log';

export type BannerRunLog = {
  timestamp?: string;
  site: string;
  username: string;
  displayName: string;
  subjectsCount: number;
  periodValue?: string;
  periodLabel?: string;
  usedFallbackPeriod?: boolean;
  scheduleScreenshots?: {
    wrapperPath: string;
    calendarPath: string;
  };
  scheduleScreenshotPath?: string;
  status: 'passed' | 'failed';
  errorCode?: string;
  errorMessage?: string;
  caso?: string;
  duracionMs?: number;
  navegador?: string;
  videos?: string[];
};

export function buildTimestampTag(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export function buildScreenshotPath(prefix: string): string {
  return buildE2EScreenshotPath('banner', prefix);
}

export function appendBannerRunLog(entry: BannerRunLog): void {
  const wrapperPath = entry.scheduleScreenshots?.wrapperPath ?? entry.scheduleScreenshotPath ?? '';
  const calendarPath = entry.scheduleScreenshots?.calendarPath ?? '';
  const capturas = [wrapperPath, calendarPath].filter(Boolean);
  const estado = entry.status === 'passed' ? 'exitoso' : 'fallido';
  const fechaHora = entry.timestamp ?? new Date().toISOString();

  const registroEspanol = {
    fecha_hora: fechaHora,
    suite: 'banner',
    caso: entry.caso ?? 'BANNER-E2E',
    sitio_o_url: entry.site,
    estado,
    duracion_ms: entry.duracionMs ?? 0,
    navegador: entry.navegador ?? 'edge-banner',
    capturas,
    videos: entry.videos,
    detalle_error: entry.errorMessage,
    usuario: entry.username,
    nombre_mostrado: entry.displayName,
    cantidad_asignaturas: entry.subjectsCount,
    periodo_valor: entry.periodValue,
    periodo_etiqueta: entry.periodLabel,
    uso_periodo_fallback: entry.usedFallbackPeriod ?? false,
    codigo_error: entry.errorCode,
    // Alias temporales de compatibilidad
    timestamp: fechaHora,
    site: entry.site,
    username: entry.username,
    displayName: entry.displayName,
    subjectsCount: entry.subjectsCount,
    periodValue: entry.periodValue,
    periodLabel: entry.periodLabel,
    usedFallbackPeriod: entry.usedFallbackPeriod,
    scheduleScreenshots: entry.scheduleScreenshots,
    scheduleScreenshotPath: wrapperPath,
    status: entry.status,
    errorCode: entry.errorCode,
    errorMessage: entry.errorMessage,
  };

  appendE2ELog(registroEspanol, { suite: 'banner', fileName: 'banner-runs.jsonl', print: true });
}

/**
 * Imprime logs detallados en consola mostrando cada paso de ejecucion
 * con timestamps e indicadores de exito/fallo.
 */
export function logDetailedConsole(step: string, status: 'start' | 'success' | 'error', message?: string): void {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const icon = status === 'start' ? '▶' : status === 'success' ? '✅' : '❌';
  const logLine = `[${timestamp}] ${icon} ${step}${message ? ': ' + message : ''}`;
  console.log(logLine);
}

/**
 * Imprime tabla ASCII resumen de la ejecucion del test
 */
export function logTableSummary(entry: BannerRunLog): void {
  const estado = entry.status === 'passed' ? '✅ EXITOSO' : '❌ FALLIDO';
  const duracionSeg = ((entry.duracionMs ?? 0) / 1000).toFixed(2);
  
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║             RESUMEN DE EJECUCION - BANNER E2E               ║');
  console.log('╠══════════════════════════════════════════════════════════════╣');
  console.log(`║ Usuario              │ ${entry.username.padEnd(45)}║`);
  console.log(`║ Nombre mostrado      │ ${entry.displayName.padEnd(45)}║`);
  console.log(`║ Asignaturas contadas │ ${String(entry.subjectsCount).padEnd(45)}║`);
  console.log(`║ Periodo              │ ${(entry.periodValue || 'N/A').padEnd(45)}║`);
  console.log(`║ Etiqueta periodo     │ ${(entry.periodLabel || 'N/A').padEnd(45)}║`);
  console.log(`║ Duracion (segundos)  │ ${duracionSeg.padEnd(45)}║`);
  console.log(`║ Navegador            │ ${(entry.navegador || 'N/A').padEnd(45)}║`);
  console.log(`║ Estado               │ ${estado.padEnd(45)}║`);
  if (entry.errorMessage) {
    console.log(`║ Error                │ ${entry.errorMessage.substring(0, 45).padEnd(45)}║`);
  }
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
}
