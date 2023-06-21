const mongoose = require('mongoose');
const chai = require('chai');
const { describe, it } = require('mocha');
const logger = require('../logger');

const { expect } = chai;
describe('MongoDB Connection', () => {
  it('should connect to MongoDB', () => mongoose.connect('mongodb://localhost:27017/storageAction')
    .then(() => {
      logger.info('MongoDB connection successful');
    })
    .catch((err) => {
      logger.eror('MongoDB connection error:', err);
      throw err;
    }));
});
