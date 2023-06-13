const myexpress = require("express")
const validator = require('../validate.js');
const Websit = require('../models/websiteModel.js');
const logger = require("../../logger.js");
const router = myexpress.Router()
module.exports = {
    createWebsite:async (req, res) => {
        try {
          const validationRule = {
            "cpu": [
              "required",
              "wedCpuTypes"
            ],
            "title": "required|string|min:3|max:50|EnglishLetters",
            "description": "required|string|min:10|max:100|desEnglishLetters",
          "domain":"isDomainAvailable",
            "typeOfDomain":"tapedomin"
          };
          const website = req.body;
          await validator(website, validationRule, {}, (err, status) => {
            if (!status) {
              logger.error(err);
              res.status(412).send({ success: false, message: 'An error occurred on the server' });
            
            
            } else {
              const message = new Websit(website);
              message.save();
              res.status(200).send({ message });
            }
          });
        } catch (error) {
          res.status(400).send({ message: error.message });
        }
}
}
