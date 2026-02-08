import fs from 'node:fs';
import path from 'node:path';

export type EstadoE2E = 'exitoso' | 'fallido';

export type RegistroE2EBase = {
  fecha_hora: string;
  suite: string;
  caso: string;
  sitio_o_url: string;
  estado: EstadoE2E;
  duracion_ms: number;
  navegador: string;
  capturas: string[];
  videos?: string[];
  detalle_error?: string;
};

type RegistroE2E = Record<string, unknown> & RegistroE2EBase;

function buildTimestampTag(date: Date = new Date()): string {
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function getE2ELogPath(suite: string, fileName = 'e2e-runs.jsonl'): string {
  const logsDir = path.resolve(process.cwd(), 'evidencias', suite, 'logs');
  ensureDir(logsDir);
  return path.join(logsDir, fileName);
}

export function buildE2EScreenshotPath(suite: string, prefix: string): string {
  const screenshotDir = path.resolve(process.cwd(), 'evidencias', suite, 'screenshots');
  ensureDir(screenshotDir);
  return path.join(screenshotDir, `${prefix}-${buildTimestampTag()}.png`);
}

export function printE2ELog(entry: RegistroE2EBase): void {
  const compact = `[E2E][${entry.suite}][${entry.estado}] caso="${entry.caso}" duracion_ms=${entry.duracion_ms}`;
  console.log(compact);
  console.log(JSON.stringify(entry, null, 2));
}

export function appendE2ELog(
  entry: RegistroE2E,
  options?: {
    suite?: string;
    fileName?: string;
    print?: boolean;
  },
): void {
  const suite = options?.suite ?? entry.suite;
  const fileName = options?.fileName ?? 'e2e-runs.jsonl';
  const jsonlPath = getE2ELogPath(suite, fileName);
  fs.appendFileSync(jsonlPath, `${JSON.stringify(entry)}\n`, 'utf8');

  if (options?.print ?? true) {
    printE2ELog(entry);
  }
}

