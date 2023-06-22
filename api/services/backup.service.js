const Website = require('../models/backupModel');

const { findById } = require('../models/websiteModel');

const Backup = require('../models/backupModel');

module.exports = {
  createBackup: async (req, res) => {
    try {
      const websiteToBackup = await findById(req.params.id).exec();
      if (!websiteToBackup) return res.status(404).send('Website not found!');
      if (websiteToBackup.backups.length > 0) return res.status(404).send('This website is already backed up');
      const backupWebsiteData = {
        ...websiteToBackup,
        status: 'backup',
        _id: undefined,
      };
      await new Website(backupWebsiteData).save();
      const backup = await new Backup({
        siteId: websiteToBackup.id,
        description: websiteToBackup.description,
      }).save();
      websiteToBackup.backups = backup;
      await websiteToBackup.save();
      return res.status(200).send('Backup created successfully');
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  },
};
