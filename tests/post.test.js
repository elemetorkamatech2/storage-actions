/* eslint-disable no-undef */
import dotenv from 'dotenv';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';

dotenv.config();

describe('post /', () => {
  it('POST / => create NEW item', async () => {
    const payload = { userId: 'user123' };
    const secretKey = process.env.KEY;
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, secretKey, options);

    const response = await request(app)
      .post('/website')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Website',
        description: 'A new website for testing purposes',
        domain: 'example.com',
        typeOfDomain: 'my-example-domain.co.uk',
        cpu: 686,
        memory: 16,
        userId: 'user123',
        status: 'pending',
        backups: [],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: expect.objectContaining({
        title: 'New Website',
        description: 'A new website for testing purposes',
        domain: expect.arrayContaining(['example.com']),
        typeOfDomain: 'my-example-domain.co.uk',
        cpu: 686,
        memory: 16,
        backups: expect.arrayContaining([]),
        status: 'pending',
        userId: expect.arrayContaining(['user123']),
      }),
    });
  });
});

describe('post /', () => {
  it('POST / => create NEW item', async () => {
    const payload = { userId: 'user123' };
    const secretKey = process.env.KEY;
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, secretKey, options);

    const response = await request(app)
      .post('/website')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Website',
        description: 'A new website for testing purposes',
        domain: 'example.com',
        typeOfDomain: 'my-example-domain.co.uk',
        cpu: 686,
        memory: 16,
        userId: ['123456'],
        status: 'pending',
        backups: [],
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: 'Invalid user ID',
    });
  });
});

describe('post /', () => {
  it('POST / => create NEW item', async () => {
    const payload = { userId: 'user123' };
    const secretKey = process.env.KEY;
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, secretKey, options);

    const response = await request(app)
      .post('/website')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Website',
        description: 'A new website for testing purposes',
        domain: 'example.com',
        typeOfDomain: 'my-example-domain.co.uk',
        cpu: 111,
        memory: 16,
        userId: 'user123',
        status: 'pending',
        backups: [],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: 'An error occurred on the server',
    });
  });
});
