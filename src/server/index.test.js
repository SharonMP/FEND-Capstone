const app = require('./index');
const request = require('supertest');
test('Test app run successful', async done => {
  const response = await request(app).get('/')
  expect(response.status).toBe(200)
  done()
});