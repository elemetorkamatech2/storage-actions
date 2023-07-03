/* eslint-disable prefer-promise-reject-errors */
import Website from '../models/websiteModel.js';
import logger from '../../logger.js';
import validator from '../validate.js';
import publisher from '../../rabbitmq/publisher.js';

// eslint-disable-next-line no-unused-vars

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
      logger.info('awsertyuio');
      const validationRule = {
        cpu: [
          'required',
          'wedCpuTypes',
        ],
        title: 'required|string|min:3|max:50|EnglishLetters',
        description: 'required|string|min:10|max:100|desEnglishLetters',
        typeOfDomain: 'domainType',
        // domain: 'isDomainAvailable',
      };
      return new Promise((resolve, reject) => {
        validator(website, validationRule, {}, async (err, status) => {
          if (!status) {
            logger.error(err);
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ success: false, message: 'the validate is not proper' });
          } else {
            await publisher('create', { website });
          }
        });
      });
    } catch (error) {
      logger.info(error);
      return { success: false, message: error.message };
    }
  },
};
