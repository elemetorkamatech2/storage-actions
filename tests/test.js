/* eslint-disable no-undef */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../logger.js';

dotenv.config();
describe('MongoDB Connection', () => {
  it('should connect to MongoDB', () => mongoose.connect(process.env.DB_CONNECTION)
    .then(() => {
      logger.info('MongoDB connection successful');
    })
    .catch((err) => {
      logger.error('MongoDB connection error:', err);
      throw err;
    }));
});
