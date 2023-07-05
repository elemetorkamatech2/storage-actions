import dotenv from 'dotenv';
import logger from '../../logger.js';

dotenv.config();

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    logger.info(token);
    if (token !== process.env.TOKEN) {
      throw new Error('Invalid token');
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
