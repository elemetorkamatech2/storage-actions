/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import websiteService from '../api/services/website.service.js';
import Website from '../api/models/websiteModel.js';
import publish from '../rabbitmq/publisher.js';
import mock from './mock.js';
import {
  websiteStatuses, errorMessages, messages, queuesNames,
} from '../enums.js';

jest.mock('../api/models/websiteModel');
jest.mock('../rabbitmq/publisher.js');

describe('start website deletion', () => {
  const website = mock.websiteForStartDeletion;
  beforeEach(() => {
    Website.findById.mockResolvedValue(website);
    website.save.mockClear();
    website.status = websiteStatuses.PENDING;
  });
  it('error - website is not found', async () => {
    Website.findById.mockResolvedValue(null);
    const result = await websiteService.startDeletion(website._id, website.userId);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: errorMessages.WEBSITE_NOT_FOUND });
  });
  it('error - unauthorized user id', async () => {
    const userId = `${website.userId}111`;
    const result = await websiteService.startDeletion(website._id, userId);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: errorMessages.UNAUTHORIZED_USER_ID });
  });
  it('error - website has been deleted yet', async () => {
    website.status = websiteStatuses.DELETED;
    const result = await websiteService.startDeletion(website._id, website.userId);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: errorMessages.WEBSITE_HAS_ALREADY_BEEN_DELETED });
  });
  it('error - website in process of deletion yet', async () => {
    website.status = websiteStatuses.ABOUT_TO_BE_DELETED;
    const result = await websiteService.startDeletion(website._id, website.userId);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: errorMessages.WEBSITE_IS_IN_PROCESS_OF_DELETION });
  });
  it(`success - change the website status to '${websiteStatuses.ABOUT_TO_BE_DELETED}'`, async () => {
    const result = await websiteService.startDeletion(website._id, website.userId);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(website.save).toHaveBeenCalled();
    expect(website.status).toEqual(websiteStatuses.ABOUT_TO_BE_DELETED);
    expect(publish).toHaveBeenCalledWith(queuesNames.DELETE_WEBSITE, { websiteId: website._id });
    expect(result).toEqual({ success: true, message: messages.THE_WEBSITE_IS_GOING_TO_BE_DELETED });
  });
  it('error - couldn\'t delete the website', async () => {
    const errorMessage = 'Couldn\'t delete the website - testing';
    website.save = jest.fn().mockRejectedValue(new Error(errorMessage));
    const result = await websiteService.startDeletion(website._id, website.userId);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(website.save).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: errorMessage });
  });
});

describe('finish website deletion', () => {
  const website = mock.websiteForEndDeletion;
  beforeEach(() => {
    Website.findById.mockResolvedValue(website);
    website.save.mockClear();
    website.status = websiteStatuses.ABOUT_TO_BE_DELETED;
  });
  it('error - website is not found', async () => {
    Website.findById.mockResolvedValue(null);
    const result = await websiteService.endDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: errorMessages.WEBSITE_NOT_FOUND });
  });
  it('error - website has been deleted yet', async () => {
    website.status = websiteStatuses.DELETED;
    const result = await websiteService.endDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(result).toEqual({ success: false, error: errorMessages.WEBSITE_HAS_ALREADY_BEEN_DELETED });
  });
  it('success - change the website status to \'deleted\'', async () => {
    const result = await websiteService.endDeletion({ websiteId: website._id });
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(website.save).toHaveBeenCalled();
    expect(website.status).toEqual(websiteStatuses.DELETED);
    expect(result).toEqual({ success: true, message: messages.THE_WEBSITE_HAS_BEEN_SUCCESSFULLY_DELETED });
  });
  it('error - couldn\'t delete the website', async () => {
    const errorMessage = 'Couldn\'t delete the website - testing';
    website.save = jest.fn().mockRejectedValue(new Error(errorMessage));
    const result = await websiteService.endDeletion(website._id);
    expect(Website.findById).toHaveBeenCalledWith(website._id);
    expect(website.save).toHaveBeenCalled();
    expect(result).toEqual({ success: false, error: errorMessage });
  });
});
