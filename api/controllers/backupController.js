// eslint-disable-next-line import/no-unresolved
import backupService from '../services/backup.service.js';

export default {
  // eslint-disable-next-line consistent-return
  createBackup: async (req, res) => {
    /*
      #swagger.tags=['backup']
    */
    try {
      const Id = req.params.id;
      const { description } = req.body;
      const result = await backupService.createBackupForQueue(Id, description);
      if (result.success) res.status(200).send(result.message);
      if (!result.success) res.status(500).send(result.message);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
  getSitaBackups: async (req, res) => {
    // eslint-disable-next-line no-empty
    try {
      const websiteId = req.params.id;
      const website = await backupService.getSitaBackups(websiteId);
      res.status(200).send({ website });
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  },
  createBackup: async (req, res) => {
    /*
      #swagger.tags=['backup']
    */
    try {
      const Id = req.params.id;
      const result = await backupService.restoredForQueue(Id);
      if (result.success) res.status(200).send(result.message);
      if (!result.success) res.status(500).send(result.message);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  },
};
