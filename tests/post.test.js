import request from 'supertest';
import app from '../app.js';

request.describe('post /', () => {
  request.it('POST / => create NEW item', () => (
    request(app)
      .post('/website')

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
        request.expect(response.body).toEqual({
          message: request.expect.objectContaining({
            title: 'New Website',
            description: 'A new website for testing purposes',
            domain: request.expect.arrayContaining(['example.com']),
            typeOfDomain: 'my-example-domain.co.uk',
            cpu: 686,
            memory: 16,
            backups: request.expect.arrayContaining([]),
            status: 'pending',
            userId: request.expect.arrayContaining(['123456']),
          }),
        });
      })
  ));
});
