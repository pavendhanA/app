import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    // 95% of requests must complete under 500ms
    http_req_duration: ['p(95)<500'],
    // Request failure rate must be less than 1%
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // Run checks on the static assets served by our local web server
  const rootRes = http.get('http://localhost:3000/');
  check(rootRes, {
    'root status is 200': (r) => r.status === 200,
  });

  const cssRes = http.get('http://localhost:3000/style.css');
  check(cssRes, {
    'css status is 200': (r) => r.status === 200,
  });

  const jsRes = http.get('http://localhost:3000/app.js');
  check(jsRes, {
    'js status is 200': (r) => r.status === 200,
  });

  // Small delay to pace requests and ensure stable CI resources
  sleep(0.1);
}
