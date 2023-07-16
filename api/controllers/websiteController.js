import websiteService from '../services/website.service.js';
import { encryptData, decryptData } from '../encryption.js';
import { errorMessages } from '../../enums.js';

export default {
  getAll: async (req, res) => {
    try {
      const websites = await websiteService.getAll();
      res.status(200).send(websites);
    } catch (error) {
      res.status(404).send(error.message);
    }
  },
  getById: async (req, res) => {
    try {
      const websiteId = req.params.id;
      const website = await websiteService.getById(websiteId);
      res.status(200).send(website);
    } catch (error) {
      if (error.message === errorMessages.WEBSITE_NOT_FOUND) {
        res.status(404).send(error.message);
      } else {
        res.status(500).send(error.message);
      }
    }
  },
  createWebsite: async (req, res) => {
    /*
      #swagger.tags=['website']
    */
    /*
   #swagger.parameters['website'] = {
      in: 'body',
     required: true,
       schema: { $ref: "#/definitions/addWebsite" }
     }
     */

    try {
      // Encrypt the website data
      const website = req.body;
      const encryptedData = encryptData(JSON.stringify(website));
      const websites = JSON.parse(decryptData(encryptedData));
      // Call the websiteService to create the website with the encrypted data
      const result = await websiteService.create(websites);
      if (result.success) {
        res.status(200).send(result.message);
      }
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  deleteWebsite: async (req, res) => {
    /*
      #swagger.tags=['website']
    */
    try {
      const websiteId = req.params.id;
      const { userId } = req.headers;
      const result = await websiteService.startDeletion(websiteId, userId);
      if (result.error) {
        if (result.error === errorMessages.COULD_NOT_DELETE_THE_WEBSITE) {
          res.status(500).send(result.error);
        } else {
          res.status(400).send(result.error);
        }
      } else { res.status(200).send(result); }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};
