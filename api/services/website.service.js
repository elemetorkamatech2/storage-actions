const Website = require('../models/websiteModel');
const logger = require('../../logger');
const validator = require('../validate');

module.exports = {
  create: async (website) => {
    try {
      const validationRule = {
        cpu: [
          'required',
          'wedCpuTypes',
        ],
        title: 'required|string|min:3|max:50|EnglishLetters',
        description: 'required|string|min:10|max:100|desEnglishLetters',
        typeOfDomain: 'tapedomin',
        domain: 'isDomainAvailable',
      };

      return new Promise((resolve, reject) => {
        validator(website, validationRule, {}, (err, status) => {
          if (!status) {
            logger.error(err);
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ success: false, message: 'An error occurred on the server' });
          } else {
            const message = new Website(website);
            message.save();
            resolve({ success: true, message });
          }
        });
      });
    } catch (error) {
      logger.info(error);

      return { success: false, message: error.message };
    }
  },
};
