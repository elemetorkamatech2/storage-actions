/* eslint-disable max-len */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
import Website from '../api/models/websiteModel.js';
import websiteService from '../api/services/website.service.js';

jest.mock('../api/models/websiteModel');
describe('subscribeChangeStatus', () => {
  const websiteId = '6476fb4b3eff4848430b4f93';
  const website = {
    id: websiteId,
    status: 'about to be active',
    save: jest.fn(),
  };

  beforeEach(() => {
    Website.findById = jest.fn().mockResolvedValue(website);
    Website.mockImplementation(() => website);
    website.save.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it(
    'should change status successfully and return success: true, message: the status changed to active',
    async () => {
      const result = await websiteService.subscribeChangeStatus(websiteId);
      expect(website.status).toBe('active');
      expect(website.save).toHaveBeenCalled();
      expect(result).toStrictEqual({ success: true, message: `the status changed to ${website.status}` });
    },
  );

  it(
    'should change status successfully and return success: true, message: the status changed to not active',
    async () => {
      website.status = 'about to be not active';
      const result = await websiteService.subscribeChangeStatus(websiteId);
      expect(website.status).toBe('not active');
      expect(website.save).toHaveBeenCalled();
      expect(result).toStrictEqual({ success: true, message: `the status changed to ${website.status}` });
    },
  );

  it(
    'should return This website status is website.status if the status is something else',
    async () => {
      website.status = 'pending';
      const result = await websiteService.subscribeChangeStatus(websiteId);
      expect(result).toStrictEqual({ error: `This website status is ${website.status}` });
    },
  );
});

