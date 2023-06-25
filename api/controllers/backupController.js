const { findById } = require('../models/websiteModel');

module.exports = {
  createBackup: async (req, res) => {
    try {
      const websiteToBackup = await findById(req.params.id).exec();
      if (!websiteToBackup) return res.status(404).send('Website not found!');
      if (websiteToBackup.backups.length > 0) return res.status(404).send('This website is already backed up');
      websiteToBackup.ImportantMessages = 'In the process of creating a backup'
      await websiteToBackup.save();
      return res.status(200).send('update successfully');
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },
};
