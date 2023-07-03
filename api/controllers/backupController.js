import backupService from '../services/Backup.service.js';

export default {
  // eslint-disable-next-line consistent-return
  createBackup: async (req, res) => {
    try {
      const params = req.params.id;
      const result = await backupService.createBackupForQueue(params);
      if (result.success) res.status(200).send({ message: result.message });
      if (!result.success) res.status(500).send({ message: result.message });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },
};