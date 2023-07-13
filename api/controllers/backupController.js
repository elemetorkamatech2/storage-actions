// eslint-disable-next-line import/no-unresolved
import backupService from '../services/Backup.service.js';

export default {
  // eslint-disable-next-line consistent-return
  createBackup: async (req, res) => {
    try {
      const Id = req.params.id;
      const result = await backupService.createBackupForQueue(Id);
      if (result.success) res.status(200).send({ message: result.message });
      if (!result.success) res.status(500).send({ message: result.message });
    } catch (err) {
      return res.status(500).send({ error: err.message });
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
};
