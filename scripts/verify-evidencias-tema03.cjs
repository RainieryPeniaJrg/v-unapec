const fs = require('node:fs');
const path = require('node:path');

const requiredPaths = [
  'evidencias/tema03/A1-diseno-casos/README.md',
  'evidencias/tema03/A2-unitarias/README.md',
  'evidencias/tema03/A3-integracion-api/README.md',
  'evidencias/tema03/A4-sistema-e2e/README.md',
  'evidencias/tema03/A5-rendimiento/README.md',
  'evidencias/tema03/A6-trazabilidad-defectos/README.md',
];

const missing = requiredPaths.filter((relativePath) =>
  !fs.existsSync(path.resolve(process.cwd(), relativePath)),
);

if (missing.length > 0) {
  console.error('Faltan evidencias base de Tema 03:');
  for (const item of missing) {
    console.error(`- ${item}`);
  }
  process.exit(1);
}

console.log('Estructura minima de evidencias Tema 03 verificada correctamente.');
