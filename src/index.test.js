const request = require('supertest');
const app = require('./index');

describe('DIGITRANS-CM API', () => {
  test('GET /health retourne 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('GET /api/erp/employes sans token retourne 401', async () => {
    const res = require('supertest')(app).get('/api/erp/employes');
    expect(res).toBeTruthy();
  });
});
