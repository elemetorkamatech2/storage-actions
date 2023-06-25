import websiteService from '../services/website.service.js';

export default {
  createWebsite: async (req, res) => {
    /*
      #swagger.tags=['website']
    */
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
