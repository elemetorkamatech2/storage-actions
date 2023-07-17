import Website from '../models/websiteModel.js';
import logger from '../../logger.js';
import validator from '../validate.js';
import publisher from '../../rabbitmq/publisher.js';

export default {
  getAll: async (Id) => {
    try {
      const websites = await Website.find({ userId: Id, status: { $nin: ['backup', 'deleted'] } }).limit(50);
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
      const website = await Website.find({ status: 'ready_to_use' }).findById(websiteId);
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
      const validationRule = {
        cpu: [
          'required',
          'wedCpuTypes',
        ],
        title: 'required|string|min:3|max:50|EnglishLetters',
        description: 'required|string|min:10|max:100|desEnglishLetters',
        typeOfDomain: 'domainType',
        domain: 'isDomainAvailable',
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
            publisher('createwebsite1', { website });
            resolve({ success: true, message: website });
          }
        });
      });
    } catch (error) {
      logger.info(error);
      return { success: false, message: error.message };
    }
  },
  createweb: async (website) => {
    try {
      // eslint-disable-next-line dot-notation
      const value = website['website'];
      value.status = 'not active';
      const Web = await new Website(value);
      await Web.save();
      // eslint-disable-next-line object-shorthand, no-undef
      return { success: true, message: message };
    } catch (error) {
      logger.info(error);
      return { success: false, message: error.message };
    }
  },

};
