import websiteService from '../services/website.service.js';
import { encryptData, decryptData } from '../encryption.js';
import { errorMessages } from '../../enums.js';
import logger from '../../logger.js';

export default {
  getAll: async (req, res) => {
    /*
 #swagger.tags=['website']
  #swagger.parameters['userId'] = {
      in: 'header',
      required: true,
      schema: { $ref: "#/definitions/getAll" }
  }
 */
    try {
      const userId = req.headers.IdUser.split(' ')[1];
      logger.info(`userId: ${userId}`);
      const websites = await websiteService.getAll(userId);
      if (websites.error) {
        if (websites.error === 'There are no active websites') { res.status(404).send({ message: websites.error }); }
        res.status(500).send({ message: websites.error });
      }
      res.status(200).send({ websites });
    } catch (error) {
      res.status(404).send(error.message);
    }
  },
  getById: async (req, res) => {
    /*
  #swagger.tags=['website']
  #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      schema: { $ref: "#/definitions/getById" }
  }
  */
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
      const userId = req.headers.user_id;
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
  changeStatus: async (req, res) => {
    try {
      const result = websiteService.publishChangeStatus(req.params.id);
      if (result.error) {
        if (result.error === errorMessages.INTERNAL_SEVERAL_ERROR) {
          res.status(401).send({ message: result.error });
        } if (result.error === errorMessages.WEBSITE_NOT_FOUND) {
          res.status(404).send({ message: result.error });
        } else {
          res.status(400).send({ message: result.error });
        }
      }
      res.status(200).send({ result });
    } catch (error) {
      res.status(401).send({ message: error.message });
    }
  },
};
