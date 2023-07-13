/* eslint-disable prefer-promise-reject-errors */
import Website from '../models/websiteModel.js';
import logger from '../../logger.js';
import validator from '../validate.js';
import publish from '../../rabbitmq/publisher.js';

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
      throw new Error('Website not found');
    } catch (error) {
      throw new Error(error.message);
    }
  },
  create: async (website) => {
    try {
      logger.info(website)
      const validationRule = {
        cpu: [
          'required',
          'wedCpuTypes',
        ],
        title: 'required|string|min:3|max:50|EnglishLetters',
        description: 'required|string|min:10|max:100|desEnglishLetters',
        typeOfDomain: 'domainType',
        //domain: 'isDomainAvailable',
      };
      return new Promise((resolve, reject) => {
        validator(website, validationRule, {}, async (err, status) => {
          if (!status) {
            logger.error(err);
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ success: false, message: 'the validate is not proper' });
          } else {
            // eslint-disable-next-line no-param-reassign
            website.status = 'pending';
            publish('createwebsite1', { website });
            resolve({ success: true, message: website });
          }
        });
      });
    } catch (error) {
      logger.info(error);
      return { success: false, message: error.message };
    }
  },
  // eslint-disable-next-line consistent-return
  createweb: async (website) => {
    try {
      // eslint-disable-next-line dot-notation
      const value = website['website'];
      value.status = 'not active';
      const Web = await new Website(value);
      await Web.save();
      // eslint-disable-next-line object-shorthand

      return { success: true, message: website };
    } catch (error) {
      logger.info(error);
      return { success: false, message: error.message };
    }
  },


  startDeletion: async (websiteId) => {
    try {
      const website = await Website.findById(websiteId);
      if (!website) return { success: false, error: 'Website doesn\'t found' };
      if (website.status === 'deleted') return { success: false, error: 'The site has already been deleted' };
      if (website.status === 'going_to_be_deleted') return { success: false, error: 'The site is in the process of deletion' };
      website.status = 'going_to_be_deleted';
      await website.save();
      publish('deleteWebsite', { websiteId });
      return { success: true, message: `the website with id: ${websiteId} is going to be deleted` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  endDeletion: async (message) => {
    try {
      logger.error(message);
      const website = await Website.findById(message.websiteId);
      if (!website) return { success: false, error: 'Website doesn\'t found' };
      if (website.status === 'deleted') return { success: false, error: 'The site has already been deleted' };
      website.status = 'deleted';
      await website.save();
      return { success: true, message: `the website with id: ${message.websiteId} has been successfully deleted` };
    } catch (error) {
      logger.error(error.message);
      return { success: false, error: error.message };
    }
  },

};
