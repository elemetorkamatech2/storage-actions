import websiteService from '../services/website.service.js';
import { encryptData, decryptData } from '../encryption.js';

async function create(encryptedWebsite) {
  const website = JSON.parse(decryptData(encryptedWebsite));
  const result = await websiteService.create(website);
  return { success: true, message: result.message };
}

export default {
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
    /*
      #swagger.tags=['website']
    */
    // #swagger.parameters['website'] = {
    //   in: 'body',
    //   required: true,
    //   schema: { $ref: "#/definitions/addWebsite" }
    // }
    try {
      // Encrypt the website data
      const website = req.body;
      const encryptedData = encryptData(JSON.stringify(website));

      // Call the websiteService to create the website with the encrypted data
      const result = await create(encryptedData);
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
