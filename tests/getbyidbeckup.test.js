import dotenv from 'dotenv';
import request from 'supertest';
import app from '../app.js';

describe('getById', () => {
  it('GET / => items by ID', () => request(app)
    .get('/1')

    .expect('Content-Type', /json/)

    .expect(200)

    .then((response) => {
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),

          name: expect.any(String),

          inStock: expect.any(Boolean),
        }),
      );
    }));

  it('GET /id => 404 if item not found', () => request(app).get('/10000000000').expect(404));
});
