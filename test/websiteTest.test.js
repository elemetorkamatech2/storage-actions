/* eslint-disable no-undef */
const express = require('express');
const rout = require('../api/routes/websiteRoute');
const { getById } = require('../api/controller/websiteController');

const app = express();
app.use('/', rout);

test('should return a 404 error if the website with the given id is not found', () => {
  const mockReq = { params: { id: 'jkl' } };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  getById(mockReq, mockRes);
  expect(mockRes.status).toHaveBeenCalledWith(404);
  expect(mockRes.send).toHaveBeenCalledWith('Website not found');
});

test('should return a 200  if the website with the given id found', () => {
  const mockReq = { params: { id: '649202a80a0bc95af430a181' } };
  const mockRes = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  };
  getById(mockReq, mockRes);
  expect(mockRes.status).toHaveBeenCalledWith(200);
  expect(mockRes.send).toHaveBeenCalledWith({
    website: {
      _id: '649202a80a0bc95af430a181',
      title: 'New Website',
      description: 'A new website for testing purposes',
      domain: [],
      typeOfDomain: 'my-example-domain.co.uk',
      cpu: 686,
      memory: 16,
      status: 'pending',
      backups: [],
      userId: [
        'user123',
      ],
      __v: 0,
    },
  });
});
