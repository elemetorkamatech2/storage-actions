/* eslint-disable no-undef */
import controller from '../api/controllers/websiteController.js';

import websiteModel from '../api/models/websiteModel.js';

describe('getAll function', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  it('should return a list of websites and status 200 for a valid request with a valid token', async () => {
    const token = 'valid_token';
    req.headers.authorization = `Bearer ${token}`;

    const website1 = {
      __v: 0, _id: '6489b2d90eb569aee1edaab4', backups: [], cpu: 4, description: 'A personal website showcasing my projects and interests', domain: ['mywebsite.com', 'www.mywebsite.com'], memory: 8, status: '200', title: 'My Website', typeOfDomain: 'Primary',
    };
    const website2 = {
      __v: 0, _id: '6489b3160eb569aee1edaab7', backups: [], cpu: 4, description: 'goooood!!!!', domain: ['mywebsite.com', 'www.mywebsite.com'], memory: 8, status: '200', title: 'My Website2', typeOfDomain: 'Primary',
    };
    websiteModel.find = jest.fn().mockResolvedValue([website1, website2]);

    await controller.getAll(req, res);

    expect(websiteModel.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ websites: [website1, website2] });
  });
  it('should return status 404 and an error message for an invalid request', async () => {
    const token = 'valid_token';
    req.headers.authorization = `Bearer ${token}`;
    websiteModel.find = jest.fn().mockRejectedValue(new Error('Error message'));

    await controller.getAll(req, res);

    expect(websiteModel.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'Error message' });
  });
});
