export function calcularDescuento(monto: number, categoria: string): number {
  if (categoria === 'A') {
    return monto >= 1000 ? monto * 0.1 : 0;
  }

  if (categoria === 'B') {
    return monto * 0.05;
  }

  return 0;
}
