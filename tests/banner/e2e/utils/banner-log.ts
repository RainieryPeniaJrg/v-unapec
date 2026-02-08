import fs from 'node:fs';
import path from 'node:path';

export type BannerRunLog = {
  timestamp: string;
  site: string;
  username: string;
  displayName: string;
  subjectsCount: number;
  scheduleScreenshotPath: string;
  status: 'passed' | 'failed';
  errorCode?: string;
  errorMessage?: string;
};

const screenshotDir = path.resolve(process.cwd(), 'evidencias', 'banner', 'screenshots');
const logsDir = path.resolve(process.cwd(), 'evidencias', 'banner', 'logs');
const jsonlPath = path.join(logsDir, 'banner-runs.jsonl');

function ensureDirs(): void {
  fs.mkdirSync(screenshotDir, { recursive: true });
  fs.mkdirSync(logsDir, { recursive: true });
}

export function buildTimestampTag(date: Date = new Date()): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export function buildScreenshotPath(prefix: string): string {
  ensureDirs();
  const tag = buildTimestampTag();
  return path.join(screenshotDir, `${prefix}-${tag}.png`);
}

export function appendBannerRunLog(entry: BannerRunLog): void {
  ensureDirs();
  fs.appendFileSync(jsonlPath, `${JSON.stringify(entry)}\n`, 'utf8');
}
