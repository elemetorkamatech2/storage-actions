/* eslint-disable max-len */
/* eslint-disable prefer-promise-reject-errors */
import Website from '../models/websiteModel.js';
import logger from '../../logger.js';
import validator from '../validate.js';
import publish from '../../rabbitmq/publisher.js';
import {
  errorMessages, queuesNames, websiteStatuses, messages,
} from '../../enums.js';

export default {
  getAll: async () => {
    try {
      const websites = await Website.find();
      return websites;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getById: async (websiteId) => {
    try {
      const website = await Website.findById(websiteId);
      if (website) {
        return website;
      }
      throw new Error(errorMessages.WEBSITE_NOT_FOUND);
    } catch (error) {
      throw new Error(error.message);
    }
  },
  create: async (website) => {
    try {
      logger.info(website);
      const validationRule = {
        cpu: [
          'required',
          'wedCpuTypes',
        ],
        title: 'required|string|min:3|max:50|EnglishLetters',
        description: 'required|string|min:10|max:100|desEnglishLetters',
        typeOfDomain: 'domainType',
        memory: 'required|min:10',
        // domain: 'isDomainAvailable',

      };
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line consistent-return
        validator(website, validationRule, {}, async (err, status) => {
          if (!status) {
            logger.error(err);
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ success: false, message: errorMessages.THE_VALIDATE_IS_NOT_PROPER });
          } else {
            if (website.status === websiteStatuses.PENDING) return { success: false, error: errorMessages.WEBSITE_IS_ALREADY_PENDING };
            if (website.status === websiteStatuses.INACTIVE) return { success: false, error: errorMessages.WEBSITE_IS_ALREADY_INACTIVE };
            // eslint-disable-next-line no-param-reassign
            website.status = websiteStatuses.PENDING;
            publish(queuesNames.CREATE_WEBSITE, { website });
            resolve({ success: true, message: website });
          }
        });
      });
    } catch (error) {
      logger.info(error);
      return { success: false, message: error.message };
    }
  },
  createWebsite: async (website) => {
    try {
      // eslint-disable-next-line dot-notation
      const value = website['website'];
      value.status = websiteStatuses.INACTIVE;
      const Web = await new Website(value);
      await Web.save();
      return { success: true, message: website };
    } catch (error) {
      logger.info(error);
      return { success: false, message: error.message };
    }
  },
  startDeletion: async (websiteId, userId) => {
    try {
      const website = await Website.findById(websiteId);
      if (!website) return { success: false, error: errorMessages.WEBSITE_NOT_FOUND };
      if (website.userId !== userId) {
        return { success: false, error: errorMessages.UNAUTHORIZED_USER_ID };
      }
      if (website.status === websiteStatuses.DELETED) {
        return { success: false, error: errorMessages.WEBSITE_HAS_ALREADY_BEEN_DELETED };
      }
      if (website.status === websiteStatuses.ABOUT_TO_BE_DELETED) {
        return { success: false, error: errorMessages.WEBSITE_IS_IN_PROCESS_OF_DELETION };
      }
      website.status = websiteStatuses.ABOUT_TO_BE_DELETED;
      await website.save();
      publish(queuesNames.DELETE_WEBSITE, { websiteId });
      return { success: true, message: messages.THE_WEBSITE_IS_GOING_TO_BE_DELETED };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  endDeletion: async (message) => {
    try {
      logger.error(message);
      const website = await Website.findById(message.websiteId);
      if (!website) return { success: false, error: errorMessages.WEBSITE_NOT_FOUND };
      if (website.status === 'deleted') return { success: false, error: errorMessages.WEBSITE_HAS_ALREADY_BEEN_DELETED };
      website.status = websiteStatuses.DELETED;
      await website.save();
      return { success: true, message: messages.THE_WEBSITE_HAS_BEEN_SUCCESSFULLY_DELETED };
    } catch (error) {
      logger.error(error.message);
      return { success: false, error: error.message };
    }
  },
};
