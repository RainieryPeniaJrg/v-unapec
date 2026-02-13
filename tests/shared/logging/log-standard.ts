/**
 * Unified Logging Standard for E2E Tests
 * 
 * Objective: Provide consistent logging across all E2E test suites
 * (Tema02-E6, Tema03-A4, Banner E2E)
 * 
 * Usage:
 *   const logger = createTestLogger('T03-A4', 'flujo-login-logout');
 *   logger.start('Iniciando test');
 *   logger.step('Login con credenciales válidas', 'success');
 *   logger.finish('PASSED');
 */

import * as fs from 'fs';
import * as path from 'path';

export type TestResult = 'PASSED' | 'FAILED';
export type StepStatus = 'start' | 'success' | 'error' | 'warning' | 'info';

/**
 * Structure for a logged test entry
 */
export interface TestLogEntry {
  testId: string;
  suite: string;
  startTime: string;
  endTime?: string;
  duration?: number; // ms
  resultado: TestResult;
  steps: StepLogEntry[];
  metadata: {
    browser?: string;
    osVersion?: string;
    navegador?: string;
  };
}

/**
 * Structure for individual step within a test
 */
export interface StepLogEntry {
  timestamp: string;
  step: string;
  status: StepStatus;
  duration?: number; // ms
  message?: string;
}

/**
 * Test Logger class
 */
export class TestLogger {
  private testId: string;
  private suite: string;
  private startTime: Date;
  private steps: StepLogEntry[] = [];
  private currentStepStart?: Date;
  private logFilePath: string;

  constructor(testId: string, suite: string, logDir?: string) {
    this.testId = testId;
    this.suite = suite;
    this.startTime = new Date();
    
    // Determine log directory
    const baseLogDir = logDir || path.join(process.cwd(), 'evidencias', 'logs');
    if (!fs.existsSync(baseLogDir)) {
      fs.mkdirSync(baseLogDir, { recursive: true });
    }

    const timestamp = this.startTime.toISOString().replace(/[:.]/g, '-');
    this.logFilePath = path.join(baseLogDir, `${testId}-${timestamp}.jsonl`);
  }

  /**
   * Log test start
   */
  public start(message: string = ''): void {
    this.logToConsole('start', `[${this.testId}] Test iniciado${message ? ': ' + message : ''}`);
  }

  /**
   * Log individual step
   */
  public step(stepName: string, status: StepStatus = 'info', message?: string): void {
    const now = new Date();
    const timestamp = now.toISOString();

    // Calculate duration if we had a previous step
    let duration: number | undefined;
    if (this.currentStepStart) {
      duration = now.getTime() - this.currentStepStart.getTime();
    }
    this.currentStepStart = new Date();

    this.steps.push({
      timestamp,
      step: stepName,
      status,
      duration,
      message,
    });

    this.logToConsole(status, `  → ${stepName}${message ? ': ' + message : ''}`);
  }

  /**
   * Log test finish
   */
  public finish(resultado: TestResult, metadata?: any): void {
    const endTime = new Date();
    const duration = endTime.getTime() - this.startTime.getTime();

    const entry: TestLogEntry = {
      testId: this.testId,
      suite: this.suite,
      startTime: this.startTime.toISOString(),
      endTime: endTime.toISOString(),
      duration,
      resultado,
      steps: this.steps,
      metadata: {
        ...metadata,
        navegador: 'Edge (Playwright)',
        osVersion: process.platform,
      },
    };

    // Write to JSONL
    this.appendToJsonlLog(entry);

    // Log to console
    const icon = resultado === 'PASSED' ? '✅' : '❌';
    const statusMsg = resultado === 'PASSED' ? 'Test completado exitosamente' : 'Test falló';
    this.logToConsole(resultado === 'PASSED' ? 'success' : 'error', 
      `${icon} ${statusMsg} (${duration}ms)`);
  }

  /**
   * Get current step count
   */
  public getStepCount(): number {
    return this.steps.length;
  }

  /**
   * Log to console with formatting
   */
  private logToConsole(status: StepStatus, message: string): void {
    const timestamp = new Date().toLocaleTimeString('es-ES');
    const statusIcon = this.getStatusIcon(status);
    console.log(`[${timestamp}] ${statusIcon} ${message}`);
  }

  /**
   * Map status to console icon
   */
  private getStatusIcon(status: StepStatus): string {
    switch (status) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'start':
        return '🚀';
      case 'info':
      default:
        return 'ℹ️';
    }
  }

  /**
   * Append entry to JSONL log file
   */
  private appendToJsonlLog(entry: TestLogEntry): void {
    const jsonlLine = JSON.stringify(entry) + '\n';
    fs.appendFileSync(this.logFilePath, jsonlLine);
    console.log(`\n📝 Log guardado en: ${this.logFilePath}\n`);
  }
}

/**
 * Factory function to create a test logger
 */
export function createTestLogger(testId: string, suite: string, logDir?: string): TestLogger {
  return new TestLogger(testId, suite, logDir);
}

/**
 * Helper to read all JSONL logs from a directory
 */
export function readJsonlLogs(logDir: string): TestLogEntry[] {
  if (!fs.existsSync(logDir)) {
    return [];
  }

  const entries: TestLogEntry[] = [];
  const files = fs.readdirSync(logDir).filter(f => f.endsWith('.jsonl'));

  files.forEach(file => {
    const content = fs.readFileSync(path.join(logDir, file), 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    lines.forEach(line => {
      try {
        entries.push(JSON.parse(line));
      } catch (e) {
        console.warn(`Error parsing JSONL line in ${file}:`, e);
      }
    });
  });

  return entries;
}

/**
 * Helper to print ASCII table summary of test results
 */
export function printTestSummary(entries: TestLogEntry[]): void {
  if (entries.length === 0) {
    console.log('No test entries found');
    return;
  }

  console.log('\n📊 TEST SUMMARY\n');
  console.log('┌─────────────────────┬────────────────┬──────────────┬────────────┐');
  console.log('│ Test ID             │ Suite          │ Duration     │ Resultado  │');
  console.log('├─────────────────────┼────────────────┼──────────────┼────────────┤');

  entries.forEach(entry => {
    const testIdPad = entry.testId.padEnd(19);
    const suitePad = (entry.suite || '-').substring(0, 14).padEnd(14);
    const durationPad = (entry.duration ? `${entry.duration}ms` : '-').padEnd(12);
    const resultIcon = entry.resultado === 'PASSED' ? '✅ PASSED' : '❌ FAILED';

    console.log(
      `│ ${testIdPad} │ ${suitePad} │ ${durationPad} │ ${resultIcon.padEnd(10)} │`
    );
  });

  console.log('└─────────────────────┴────────────────┴──────────────┴────────────┘\n');

  const passed = entries.filter(e => e.resultado === 'PASSED').length;
  const failed = entries.filter(e => e.resultado === 'FAILED').length;
  const totalDuration = entries.reduce((sum, e) => sum + (e.duration || 0), 0);

  console.log(`Total: ${entries.length} tests | Passed: ${passed} | Failed: ${failed}`);
  console.log(`Total Duration: ${totalDuration}ms\n`);
}
