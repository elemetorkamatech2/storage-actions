/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';

import dotenv from 'dotenv';
import websiteService from '../api/services/website.service.js';
import app from '../app.js';
import Website from '../api/models/websiteModel.js';

const website = {
  _id: '649877bde1dd83dca315bc63',
  title: 'New Website',
  description: 'A new website for testing purposes',
  domain: [
    'example.com',
  ],
  typeOfDomain: 'my-example-domain.co.uk',
  cpu: 686,
  memory: 16,
  status: 'deleted',
  backups: [],
  userId: [
    'user123',
  ],
  __v: 1,
  ImportantMessages: [],
};

dotenv.config();

jest.mock('../api/models/websiteModel');
jest.mock('../api/services/website.service.js');

websiteService.delete.mockResolvedValue({ success: true, message: `the website with id: ${website._id} is going to be deleted` });
const token = process.env.TOKEN;
describe('start website deletion', () => {
  beforeEach(() => {
    websiteService.delete.mockClear();
    Website.mockImplementation(() => website);
    Website.findById.mockReturnValue({ exec: jest.fn().mockResolvedValue(website) });
    website.toObject.mockClear();
    website.save.mockClear();
    // req.headers.authorization = `Bearer ${token}`;
    // setHeader('authorization', `Bearer ${token}`);
  });
  it('delete website - website has been deleted yet', async () => {
    website.status = 'deleted';
    console.log('in test');
    console.log(website.status);
    // websiteService.delete.mockResolvedValueOnce({ message: { error: 'The site has been deleted yet' } });
    await request(app).delete(`/website/${website._id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(400, { message: { error: 'The site has been deleted yet' } });
  });
  it('change the website status to \'going_to_be_deleted', async () => {
    await request(app).delete(`/website/${website._id}`)
      .set('authorization', `Bearer ${token}`)
      .expect(200, { result: { success: true, message: `the website with id: ${website._id} is going to be deleted` } });
  });
});
// test('delete website', () => {
//   Delete(, jest.fn());
// })

// /* eslint-disable no-undef */
// import request from 'supertest';
// import { expect } from 'expect';

// import app from '../app.js';

// describe('Testing DELETE/website/:id endpoint', () => {
//   it('respond with valid HTTP status code and valid authorization', async () => {
//     const id = '649879027f5f7caf7d624c59';
// eslint-disable-next-line max-len
//     const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNjg4Mjk4NDUzLCJleHAiOjE2ODgzMDIwNTN9.Ed_nghvW2c4i7S5dSxsLOfbNQMkrf3VBHDHKv3UWOMU';
//     const response = await request(app)
//       .post(`/website/${id}`)
//     //   .setHeader('authorization', token);
//       .set('authorization', `Bearer ${token}`);
//     expect(response.statusCode).toBe(200);
//     expect(response.body.success).toBe(true);
//   });
// });
