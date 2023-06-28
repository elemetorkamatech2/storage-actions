import websiteService from '../services/websiteService.js';
import { encryptData, decryptData } from '../encryption.js';

async function create(encryptedWebsite) {
  const website = JSON.parse(decryptData(encryptedWebsite));
  const result = await websiteService.create(website);
  return { success: true, message: result.message };
}

export default {
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
