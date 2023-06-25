const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();
const key = crypto
  .createHash('sha512')
  .update(process.env.secret_key)
  .digest('hex')
  .substring(0, 32);

const encryptionIV = crypto
  .createHash('sha512')
  .update(process.env.secret_iv)
  .digest('hex')
  .substring(0, 16);

// eslint-disable-next-line func-names
module.exports.encryptData = function (data) {
  const cipher = crypto.createCipheriv(process.env.ecnryption_method, key, encryptionIV);
  return Buffer.from(
    cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64');
};

// eslint-disable-next-line func-names
module.exports.decryptData = function (encryptedData) {
  const buff = Buffer.from(encryptedData, 'base64');
  const decipher = crypto.createDecipheriv(process.env.ecnryption_method, key, encryptionIV);
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8')
    + decipher.final('utf8')
  );
};
