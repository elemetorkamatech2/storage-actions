/* eslint-disable no-undef */
import request from 'supertest';
import dotenv from 'dotenv';

import app from '../app.js';
import { websiteStatuses, errorMessages } from '../enums.js';

dotenv.config();

describe('post /', () => {
  it('POST / => create NEW item  and status 200 for a valid request with a valid token ', async () => {
    const token = process.env.TOKEN;
    const response = await request(app)
      .post('/website')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Website export',
        description: 'A new website for testing purposes',
        domain: 'example.com',
        typeOfDomain: 'my-example-domain.co.uk',
        cpu: 686,
        memory: 16,
        userId: 'user123',
        backups: [],
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      title: 'New Website export',
      description: 'A new website for testing purposes',
      domain: 'example.com',
      typeOfDomain: 'my-example-domain.co.uk',
      cpu: 686,
      memory: 16,
      userId: 'user123',
      status: websiteStatuses.PENDING,
      backups: [],
    });
  });

  it('POST / =>should return status 401 and an error message for a request with an invalid or missing token', async () => {
    const token = 'eyJh5cCI6IkpXVCJ9';
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
        userId: '123456',
        backups: [],
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      error: errorMessages.INVALID_TOKEN,
    });
  });
});
describe('post /', () => {
  it('POST / => A 400 status and an error message should be returned for an invalid object', async () => {
    const token = process.env.TOKEN;
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
        backups: [],
      });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
    });
  });
});
describe('post /', () => {
  it('POST / => should return status 404 and an error message for an invalid request', async () => {
    const token = process.env.TOKEN;
    const response = await request(app)
      .post('/websites')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'New Website',
        description: 'A new website for testing purposes',
        domain: 'example.com',
        typeOfDomain: 'my-example-domain.co.uk',
        cpu: 111,
        memory: 16,
        userId: 'user123',
        status: websiteStatuses.PENDING,
        backups: [],
      });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
    });
  });

  it('POST / => create NEW restored  and status 200 for a valid request with a valid token ', async () => {
    const token = process.env.TOKEN;
    const response = await request(app)
      .post('/backup/64b3c78a182f205df48e5b87')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userId: 'user123',
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      ImportantMessages: 'inProcess',
      __v: 0,
      _id: '64b3c78a182f205df48e5b87',
      title: 'yettttt Website',
      description: 'A new website for testing purposes',
      domain: ['example.com'],
      typeOfDomain: 'my-example-domain.co.uk',
      cpu: 686,
      memory: 16,
      userId: 'user123',
      backups: [],
      status: 'About to be restored',
    });
  });
});
