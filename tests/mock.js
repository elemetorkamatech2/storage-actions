import { websiteStatuses } from '../enums.js';
/* eslint-disable no-undef */
const websiteForStartDeletion = {
  _id: '649877bde1dd83dca315bc63',
  status: websiteStatuses.PENDING,
  userId: 'user123',
  save: jest.fn(),
};
const websiteForEndDeletion = {
  _id: '649877bde1dd83dca315bc63',
  status: websiteStatuses.ABOUT_TO_BE_DELETED,
  save: jest.fn(),
};
export default {
  websiteForStartDeletion,
  websiteForEndDeletion,
};
