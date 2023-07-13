import backupService from '../services/backup.service.js';

export default {
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
      res.status(500).send(err.message);
    }
  },
};
