/* eslint-disable linebreak-style */
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
  // eslint-disable-next-line consistent-return
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
    }
  },
};
