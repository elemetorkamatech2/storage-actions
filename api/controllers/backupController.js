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
};
