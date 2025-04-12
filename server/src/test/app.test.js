const request = require('supertest');
const app = require('../app'); // Reuse the app from one source

describe('GET /ping', () => {
  it('should return pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.text).toBe('pong');
    expect(res.statusCode).toBe(200);
  });
});

describe('GET /pong', () => {
    it('should return pong', async () => {
      const res = await request(app).get('/pong');
      expect(res.text).toBe('allo');
      expect(res.statusCode).toBe(200);
    });
  });
  
