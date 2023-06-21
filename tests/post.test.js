/* eslint-disable no-undef */
const request = require('supertest');
const app = require('../app');

describe('post /', () => {
  it('POST / => create NEW item', () => (
    request(app)
      .post('/messages/website')

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
      })

      .expect('Content-Type', /json/)

      .expect(200)

      .then((response) => {
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
            userId: expect.arrayContaining(['123456']),
          }),
        });
      })
  ));
});
