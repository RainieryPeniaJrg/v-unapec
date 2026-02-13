# T03-A5: Performance Testing with k6

## Objetivo
Realizar pruebas de carga y rendimiento del módulo de cálculo de saldos usando **k6**, un framework moderno de testing de rendimiento.

## Requisitos

### 1. Instalación de k6

#### Opción A: Instalación Global (Recomendada)

**Windows (using Chocolatey):**
```bash
choco install k6
```

**Windows (usando Instalador directo):**
1. Descarga desde: https://github.com/grafana/k6/releases
2. Busca `k6-vX.X.X-windows-amd64.zip`
3. Extrae el archivo y agrega la carpeta a `PATH`
4. Verifica instalación: `k6 --version`

**macOS (usando Homebrew):**
```bash
brew install k6
```

**Linux (Debian/Ubuntu):**
```bash
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6-stable.list
sudo apt-get update
sudo apt-get install k6
```

#### Opción B: Instalación Local (NPM)
```bash
npm install -D k6
```
Luego ejecuta: `npx k6 run tests/lab-tema03/performance/saldo-load.k6.js`

### 2. Verificación de Instalación

```bash
k6 --version
# Esperado: k6 vX.X.X
```

## Ejecución de Pruebas

### Test Básico (Sin Configuración)
```bash
npm run test:tema03:perf
```

### Test con Entorno Personalizado
```bash
# Apunta a un servidor de prueba específico
K6_BASE_URL=https://api.ejemplo.com npm run test:tema03:perf
```

### Test con Salida Detallada
```bash
k6 run -v tests/lab-tema03/performance/saldo-load.k6.js
```

### Test con Reporte HTML (requiere k6 con extensión)
```bash
k6 run --out json=results.json tests/lab-tema03/performance/saldo-load.k6.js
```

## Configuración de Pruebas

### Archivo Actual: `saldo-load.k6.js`

**Descripción:** Test de carga para validar performance del cálculo de saldos.

**Configuración por defecto:**
- **VUs (Virtual Users):** 10 usuarios concurrentes
- **Duración:** 30 segundos
- **Thresholds (Umbrales):**
  - Error rate < 1%
  - Latencia p95 < 500ms

**Variables de Entorno:**
```bash
K6_BASE_URL    # URL base del API a probar (default: test-api.k6.io)
K6_ITERATIONS  # Número de iteraciones (opcional)
```

## Métricas Esperadas

Al ejecutar, verás métricas como:

```
     data_received..............: 1.2 MB  40 kB/s
     data_sent.................: 570 B   19 B/s
     http_req_blocked..........: avg=5ms   min=1ms    max=50ms   p(90)=15ms p(95)=20ms
     http_req_connecting.......: avg=2ms   min=0s     max=30ms   p(90)=8ms  p(95)=12ms
     http_req_duration.........: avg=150ms min=100ms  max=250ms  p(90)=200ms p(95)=220ms
     http_req_failed...........: 0%
     http_req_receiving........: avg=10ms  min=5ms    max=30ms   p(90)=20ms p(95)=25ms
     http_req_sending..........: avg=5ms   min=1ms    max=15ms   p(90)=10ms p(95)=12ms
     http_req_tls_handshaking..: avg=10ms  min=0s     max=40ms   p(90)=20ms p(95)=25ms
     http_req_waiting..........: avg=130ms min=80ms   max=200ms  p(90)=170ms p(95)=190ms
     http_reqs.................: 300      10 req/s
     iteration_duration........: avg=1.2s  min=1.1s   max=1.5s   p(90)=1.3s p(95)=1.4s
     iterations...............: 300      10 itr/s
     vus......................: 10       min=10     max=10
     vus_max..................: 10       min=10     max=10
```

## Criterios de Aceptación (T03-A5)

✅ **La prueba PASA si:**
1. `http_req_failed < 1%` - Menos del 1% de requests fallan
2. `http_req_duration p(95) < 500ms` - El percentil 95 de latencia está bajo 500ms
3. Ejecución completa **sin errores críticos**
4. Duración total ≈ 30 segundos (según configuración)

❌ **La prueba FALLA si:**
1. Cualquier threshold excede su límite
2. Error de conexión al servidor
3. Timeout durante ejecución

## Interpretación de Resultados

| Métrica | Significado | Rango Bueno |
|---------|-------------|------------|
| `http_req_duration` (p95) | Percentil 95 de latencia | < 500ms |
| `http_req_failed` | % de requests fallidas | < 1% |
| `http_reqs` | Total de requests completados | Esperado: ~300 (10 VU × 30s) |
| `vus` | Usuarios virtuales activos | Constante = 10 |

## Troubleshooting

### Error: "comando k6 no encontrado"
**Solución:** Instala k6 siguiendo la Opción A arriba, o usa `npx k6` si lo instalaste localmente.

### Error: "Connection refused"
**Solución:** Verifica que `K6_BASE_URL` apunta a un servidor válido:
```bash
K6_BASE_URL=https://httpbin.org npm run test:tema03:perf
```

### Test muy lento o timeout
**Solución:** Reduce VUs o duración editando `saldo-load.k6.js`:
```javascript
export const options = {
  vus: 5,        // Reduce de 10 a 5
  duration: '15s' // Reduce de 30 a 15 segundos
};
```

## Referencias PDF

**De:** Lab-Tema03-ISO410.pdf
**Actividad:** Actividad 5 - Pruebas de Rendimiento
**Criterios:** 
- ✓ Implementa framework de carga (k6)
- ✓ Define métricas y umbrales
- ✓ Documentación de ejecución

## Links Útiles

- [k6 Documentación Oficial](https://k6.io/docs/)
- [k6 GitHub](https://github.com/grafana/k6)
- [k6 Community](https://community.k6.io/)
