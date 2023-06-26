import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';

describe('post /', () => {
  it('POST / => create NEW item', async () => {
    const payload = { userId: 'user123' };
    const secretKey = 'a2b1c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2';
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
// describe('POST /website', () => {
//   it('creates a new item', () => (
//     request(app)
//       .post('/website')
//       .send({
//         title: 'New Website',
//         description: 'A new website for testing purposes',
//         domain: 'example.com',
//         typeOfDomain: 'my-example-domain.co.uk',
//         cpu: 686,
//         memory: 16,
//         userId: ['123456'],
//         status: 'pending',
//         backups: [],
//       })
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .then((response) => {
//         expect(response.body).toEqual({
//           message: expect.objectContaining({
//             title: 'New Website',
//             description: 'A new website for testing purposes',
//             domain: expect.arrayContaining(['example.com']),
//             typeOfDomain: 'my-example-domain.co.uk',
//             cpu: 686,
//             memory: 16,
//             backups: expect.arrayContaining([]),
//             status: 'pending',
//             userId: expect.arrayContaining(['123456']),
//           }),
//         });
//       })
//   ));
// });
