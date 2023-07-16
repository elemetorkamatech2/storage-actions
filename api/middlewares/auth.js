import dotenv from 'dotenv';
// eslint-disable-next-line no-unused-vars
import logger from '../../logger.js';

dotenv.config();

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (token !== process.env.token) {
      throw new Error('Invalid token');
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
