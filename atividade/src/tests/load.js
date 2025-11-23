import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '1m', target: 50 }, // Ramp-up: sobe de 0 a 50 usuários em 1 min
        { duration: '2m', target: 50 }, // steady: mantém 50 usuários por 2 min
        { duration: '30s', target: 0 }, // Ramp-down: reduz de 50 a 0 em 30s
    ],
};

export default function () {
    const url = 'http://localhost:3000/checkout/simple';
    const payload = JSON.stringify({}); // corpo vazio, pois o endpoint não exige dados
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const res = http.post(url, payload, params);

    check(res, {
        'status é 201': (r) => r.status === 201,
        'resposta contém APPROVED': (r) => r.json('status') === 'APPROVED',
    });

    sleep(1); // pausa entre as requisições
}
