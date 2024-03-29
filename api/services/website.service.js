
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
  getAll: async (Id) => {
    try {
      const websites = await Website.find({ userId: Id, status: { $nin: [websiteStatuses.BACKUP, websiteStatuses.DELETED] } }).limit(50);
      if (!websites || websites.length === 0) {
        return { error: `There are no active websites for user ${Id}` };
      }
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
      logger.info(`website ${website}`);
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
            const Web = await new Website(website);
            await Web.save();
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
      // eslint-disable-next-line object-shorthand
      return { success: true, message: website };
    } catch (error) {
      logger.info(error);
      return { success: false, message: error.message };
    }
  },

  // eslint-disable-next-line no-unused-vars, consistent-return
  put: async (websiteObj) => {
    console.log(websiteObj);
    // eslint-disable-next-line no-empty
    try {
      // eslint-disable-next-line no-unused-vars
      const validation = {
        cpu: [
          'required',
          'wedCpuTypes',
        ],
        title: 'required|string|min:3|max:50|EnglishLetters',
        description: 'required|string|min:10|max:100|desEnglishLetters',
        typeOfDomain: 'domainType',
      // eslint-disable-next-line padded-blocks
      };
      return new Promise((resolve, reject) => {
        validator(websiteObj, validation, {}, async (err, status) => {
          if (!status) {
            console.log(status);
            logger.error(err);
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ success: false, message: 'the validate is not proper' });
            console.log(status);
          } else {
            // eslint-disable-next-line no-param-reassign
            websiteObj.status = 'pending';
            publisher('putwebsite', { websiteObj });
            resolve({ success: true, message: websiteObj });
          }
        });
      });
    } catch (error) {
      console.log(error);

      return { success: false, message: error.message };
    }
  },

  putWeb: async (websiteObj) => {
    console.log('editWebsite');
    try {
      console.log(websiteObj);

      const editWebsite = await Website.findByIdAndUpdate(
        // eslint-disable-next-line no-underscore-dangle
        websiteObj._id,
        websiteObj,
        { new: true, upsert: true },
      );
      logger.info(editWebsite);
      console.log(editWebsite);
      return { success: true, message: editWebsite };
    } catch (error) {
      return { success: false, message: error.message };
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
  publishChangeStatus: async (websiteId) => {
    try {
      const website = await Website.findById(websiteId);
      if (!website) return { error: errorMessages.WEBSITE_NOT_FOUND };
      if (website.status === websiteStatuses.INACTIVE) {
        website.status = websiteStatuses.ABOUT_TO_BE_ACTIVE;
        await website.save();
        publish(queuesNames.CHANGE_STATUS, websiteId);
        logger.info(`seccuss change status to ${website.status}`);
        return { success: true, message: `seccuss change status to ${website.status}` };
      }
      if (website.status === websiteStatuses.ACTIVE) {
        website.status = websiteStatuses.ABOUT_TO_BE_INACTIVE;
        await website.save();
        publish(queuesNames.CHANGE_STATUS, websiteId);
        logger.info(`seccuss change status to ${website.status}`);
        return { success: true, message: `seccuss change status to ${website.status}` };
      }
      return { error: `This website is already ${website.status}` };
    } catch (error) {
      return { error: errorMessages.INTERNAL_SEVERAL_ERROR };
    }
  },
  subscribeChangeStatus: async (websiteId) => {
    try {
      const website = await Website.findById(websiteId);
      if (!website) return { error: errorMessages.WEBSITE_NOT_FOUND };
      if (website.status === websiteStatuses.ABOUT_TO_BE_ACTIVE) {
        website.status = websiteStatuses.ACTIVE;
        await website.save();
        logger.info(`seccuss change status to ${website.status}`);
        return { success: true, message: `the status changed to ${website.status}` };
      }
      if (website.status === websiteStatuses.ABOUT_TO_BE_INACTIVE) {
        website.status = websiteStatuses.INACTIVE;
        await website.save();
        logger.info(`seccuss change status to ${website.status}`);
        return { success: true, message: `the status changed to ${website.status}` };
      }
      return { error: `This website status is ${website.status}` };
    } catch (error) {
      return { error: errorMessages.INTERNAL_SEVERAL_ERROR };
    }
  },
};
