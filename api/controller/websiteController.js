const websiteService = require('../services/website.service');
const websiteModel = require('../models/websiteModel');

module.exports = {
  getAll: (req, res) => {
    websiteModel.find()
      .then((websites) => { res.status(200).send({ websites }); })
      .catch((error) => { res.status(404).send({ message: error.message }); });
  },
  getById: (req, res) => {
    const websiteId = req.params.id;
    websiteModel.findById(websiteId)
      .then((website) => {
        if (website) {
          res.status(200).send({ website });
        } else {
          res.status(404).send({ message: 'Website not found' });
        }
      })
      .catch((error) => {
        res.status(500).send({ message: error.message });
      });
  },
  createWebsite: async (req, res) => {
    try {
      const website = req.body;
      const result = await websiteService.create(website);
      if (result.success) {
        res.status(200).send({ message: result.message });
      } else {
        res.status(412).send({ success: false, message: result.message });
      }
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
};
