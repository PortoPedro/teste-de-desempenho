import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '2m', target: 200 },  // Sobe até 200 usuários em 2 minutos
        { duration: '2m', target: 500 },  // Aumenta até 500 usuários
        { duration: '2m', target: 1000 }, // Aumenta até 1000 usuários
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'], // até 5% de falhas aceitáveis
        http_req_duration: ['p(95)<2000'], // 95% das requisições devem responder < 2s
    },
};

export default function () {
    const url = 'http://localhost:3000/checkout/crypto';
    const payload = JSON.stringify({});
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status é 201': (r) => r.status === 201,
    });

    sleep(1);
}
