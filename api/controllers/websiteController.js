const websiteService = require('../services/website.service');

module.exports = {
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
