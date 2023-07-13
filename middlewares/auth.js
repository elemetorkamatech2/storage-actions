import dotenv from 'dotenv';
import logger from '../logger.js';

dotenv.config();
export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    logger.info(token);
    if (token !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNjg4NDU1NDI4LCJleHAiOjE2ODg0NTkwMjh9.P2E6YfKnV-jDiKsOTrat3KWq3k5Sr-89cTQIXiueuMU') {
      throw new Error('Invalid token');
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
