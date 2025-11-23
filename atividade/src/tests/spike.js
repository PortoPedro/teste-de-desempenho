import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 },   // Carga baixa inicial
        { duration: '10s', target: 300 },  // Aumento súbito (pico)
        { duration: '1m', target: 4000 },   // Mantém o pico por 1 minuto
        { duration: '10s', target: 10 },   // Queda rápida
        { duration: '30s', target: 10 },   // Recuperação (pós-pico)
    ],
    thresholds: {
        http_req_failed: ['rate<0.05'],     // até 5% de falhas aceitáveis
        http_req_duration: ['p(95)<1000'],  // 95% das respostas abaixo de 1s
    },
};

export default function () {
    const url = 'http://localhost:3000/checkout/simple';
    const payload = JSON.stringify({});
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status é 201': (r) => r.status === 201,
        'resposta contém APPROVED': (r) => r.json('status') === 'APPROVED',
    });

    sleep(1);
}
