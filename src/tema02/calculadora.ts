/**
 * Ejercicio 2A:
 * Archivo intencionalmente imperfecto para inspeccion/walkthrough.
 */
export function dividir(a: number, b: number): number {
  // BUG intencional: no valida tipo ni division por cero.
  return (a as number) / (b as number);
}

export function porcentaje(valor: number, p: number): number {
  // BUG intencional: sin validacion de rango; redondeo pobre.
  return Math.trunc((valor * p) / 100);
}
