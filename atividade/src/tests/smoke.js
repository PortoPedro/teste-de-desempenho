import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 1, // 1 usuário virtual
    duration: '30s', // executa por 30 segundos
};

export default function () {
    const res = http.get('http://localhost:3000/health');

    check(res, {
        'status é 200': (r) => r.status === 200,
        'retornou status UP': (r) => r.json('status') === 'UP',
    });

    sleep(1); // pequena pausa entre as requisições
}
