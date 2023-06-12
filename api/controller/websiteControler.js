//var Message = require('./api/models/websiteModel.js');
const validator = require('../validate.js');

var Message = require('../models/websiteModel.js');
//const logger = require('.../logger.js');

var myexpress = require("express")
//פונ' זו מאפשרת להפריד את השרת לקבצים שונים - ביזור
//router: משתנה זה יהיה המשתנה אליו מקושרות הפונ' של השרת
var router = myexpress.Router()
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
          await validator(req.body, validationRule, {}, (err, status) => {
            if (!status) {
              res.status(412).send({
                success: false,
                message: 'Validation failed',
                data: err
              });
            } else {
              const message = new Message(req.body);
              message.save();
              res.status(200).send({ message: message });
            }
          });
        } catch (error) {
          res.status(400).send({ message: error.message });
        }
}
}
