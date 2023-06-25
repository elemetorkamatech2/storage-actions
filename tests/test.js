import mongoose from 'mongoose';
import { describe, it } from 'mocha';
import logger from '../logger.js';

describe('MongoDB Connection', () => {
  it('should connect to MongoDB', () => mongoose.connect('mongodb://localhost:27017/storageAction')
    .then(() => {
      logger.info('MongoDB connection successful');
    })
    .catch((err) => {
      logger.error('MongoDB connection error:', err);
      throw err;
    }));
});
