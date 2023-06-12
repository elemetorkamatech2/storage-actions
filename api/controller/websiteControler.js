const validator = require('../validate.js');
var Message = require('../models/websiteModel.js');
var myexpress = require("express")
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
