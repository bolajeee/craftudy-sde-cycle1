const request = require('supertest');
const app = require('../src/app')


describe( 'GET  /tasks', () => {
    test('Fails with no auth token', async() => {
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ error: 'Authentication token required'});
  })
})
