/* eslint-disable no-undef */
import websiteService from '../api/services/website.service.js';

import controller from '../api/controllers/websiteController.js';

describe('getById', () => {
  it('should return the website when it exists', async () => {
    const websiteId = '123';
    const websiteData = { id: websiteId, name: 'Example Website' };
    const req = { params: { id: websiteId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    websiteService.getById = jest.fn().mockResolvedValue(websiteData);

    await controller.getById(req, res);

    expect(websiteService.getById).toHaveBeenCalledWith(websiteId);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ website: websiteData });
  });

  it('should return a 404 error when the website does not exist', async () => {
    const websiteId = '456';
    const req = { params: { id: websiteId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    websiteService.getById = jest.fn().mockRejectedValue(new Error('Website not found'));

    await controller.getById(req, res);

    expect(websiteService.getById).toHaveBeenCalledWith(websiteId);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith({ message: 'Website not found' });
  });

  it('should return a 500 error for other errors', async () => {
    const websiteId = '789';
    const req = { params: { id: websiteId } };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    websiteService.getById = jest.fn().mockRejectedValue(new Error('Some error'));

    await controller.getById(req, res);

    expect(websiteService.getById).toHaveBeenCalledWith(websiteId);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith({ message: 'Some error' });
  });
});


