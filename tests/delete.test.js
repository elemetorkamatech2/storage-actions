/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import websiteService from '../api/services/website.service.js';
import Website from '../api/models/websiteModel.js';
import publish from '../rabbitmq/publisher.js';
import mock from './mock.js';

jest.mock('../api/models/websiteModel');
jest.mock('../rabbitmq/publisher.js');

describe('start website deletion', () => {
  const website = mock.websiteForStartDeletion;
  beforeEach(() => {
    Website.findById.mockResolvedValue(website);
    website.save.mockClear();
    website.status = 'pending';
  });
  it('error - website is not found', async () => {
    Website.findById.mockResolvedValue(null);
    const result = await websiteService.startDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: 'Website doesn\'t found' });
  });
  it('error - website has been deleted yet', async () => {
    website.status = 'deleted';
    const result = await websiteService.startDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: 'The site has already been deleted' });
  });
  it('error - website in process of deletion yet', async () => {
    website.status = 'going_to_be_deleted';
    const result = await websiteService.startDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: 'The site is in the process of deletion' });
  });
  it('success - change the website status to \'going_to_be_deleted', async () => {
    const result = await websiteService.startDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(website.save).toHaveBeenCalled();
    expect(website.status).toEqual('going_to_be_deleted');
    expect(publish).toHaveBeenCalledWith('deleteWebsite', { websiteId: website._id });
    expect(result).toEqual({ success: true, message: `the website with id: ${website._id} is going to be deleted` });
  });
  it('error - couldn\'t delete the website', async () => {
    website.save = jest.fn().mockRejectedValue(new Error('Couldn\'t delete the website - testing'));
    const result = await websiteService.startDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(website.save).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: 'Couldn\'t delete the website - testing' });
  });
});

describe('finish website deletion', () => {
  const website = mock.websiteForEndDeletion;
  beforeEach(() => {
    Website.findById.mockResolvedValue(website);
    website.save.mockClear();
    website.status = 'going_to_be_deleted';
  });
  it('error - website is not found', async () => {
    Website.findById.mockResolvedValue(null);
    const result = await websiteService.endDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: 'Website doesn\'t found' });
  });
  it('error - website has been deleted yet', async () => {
    website.status = 'deleted';
    const result = await websiteService.endDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: 'The site has already been deleted' });
  });
  it('success - change the website status to \'deleted\'', async () => {
    const result = await websiteService.endDeletion({ websiteId: website._id });
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(website.save).toHaveBeenCalled();
    expect(website.status).toEqual('deleted');
    expect(result).toEqual({ success: true, message: `the website with id: ${website._id} has been successfully deleted` });
  });
  it('error - couldn\'t delete the website', async () => {
    website.save = jest.fn().mockRejectedValue(new Error('Couldn\'t delete the website - testing'));
    const result = await websiteService.endDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(website.save).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: 'Couldn\'t delete the website - testing' });
  });
});
