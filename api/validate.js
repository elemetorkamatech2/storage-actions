const Validator = require('validatorjs');
const validator = async (body, rules, customMessages, callback) => {
    const validation = new Validator(body, rules, customMessages);
    validation.passes(() => callback(null, true));
    validation.fails(() => callback(validation.errors, false));
};

const titleEnglish =  /^[a-zA-Z\s]*$/;
Validator.register('EnglishLetters', value => titleEnglish.test(value),
    'the title mast to be with English Letters or spaces Dipulatives');

    const description =  /^[a-zA-Z\s]*$/;
Validator.register('desEnglishLetters', value => description.test(value),
    'the description mast to be with English letters or spaces Dipulatives');

    const tapedomin = /^((?!-)[A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}$/;
    Validator.register('tapedomin', value => tapedomin.test(value),
        'the tapedomin not Right');
    
    const dns = require('dns');
    function isDomainAvailable(domain) {
      return new Promise((resolve, reject) => {
        dns.resolve(domain, (err) => {
          if (err && err.code === 'ENOTFOUND') {
            resolve(true); // domain is available
          } else {
            resolve(false); // domain is not available
          }
        });
      });
    }

    Validator.register('isDomainAvailable', async (value, args) => {
        const domain = value.trim();
        const available = await isDomainAvailable(domain);
        return available;
      }, 'The domain is not available.');
    const allowedCpuTypes = [686,586,486,386  ];
// Tighten password policy
Validator.register('wedCpuTypes', value => allowedCpuTypes.includes(value),
    'the cpu mast to be 1 from the array');

module.exports = validator;
