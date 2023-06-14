const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { PUBLIC_KEY } = process.env;
const logger = require('../../logger');


async function myFunction(req, res, next) {
  const bearerHeader = req.headers.authorization;
  const token = bearerHeader && bearerHeader.split(' ')[1];
  
  if (token === undefined) return res.sendStatus(401);
  try {
    const decodeToken = jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
    req.user = decodeToken.email;
  } catch (e) {
    logger.info({ e });
    return next(new createError.Unauthorized());
  }
  return next();
}

module.exports = myFunction;
