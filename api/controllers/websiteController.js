const websiteService = require('../services/website.service');
// const websiteModel = require('../models/websiteModel');

module.exports = {
  getAll: async (req, res) => {
    try {
      const websites = await websiteService.getAll();
      res.status(200).send({ websites });
    } catch (error) {
      res.status(404).send({ message: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const websiteId = req.params.id;
      const website = await websiteService.getById(websiteId);
      res.status(200).send({ website });
    } catch (error) {
      if (error.message === 'Website not found') {
        res.status(404).send({ message: error.message });
      } else {
        res.status(500).send({ message: error.message });
      }
    }
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
