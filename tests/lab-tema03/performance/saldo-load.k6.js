import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const baseUrl = __ENV.K6_BASE_URL || 'https://test-api.k6.io/public/crocodiles/';

export default function () {
  const response = http.get(baseUrl);

  check(response, {
    'status is 200': (r) => r.status === 200,
    'latency under 1s': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
