export function suma(a: number, b: number): number {
  return a + b;
}

export function division(a: number, b: number): number {
  if (b === 0) {
    throw new Error('b no puede ser 0');
  }

  return a / b;
}

export function factorial(n: number): number {
  if (n < 0) {
    throw new Error('n >= 0');
  }

  let r = 1;
  for (let i = 2; i <= n; i += 1) {
    r *= i;
  }

  return r;
}
