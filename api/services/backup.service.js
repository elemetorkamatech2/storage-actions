/* eslint-disable quotes */
import mongoose from 'mongoose';
import Backup from '../models/backupModel.js';
import Website from '../models/websiteModel.js';
import publish from '../../rabbitmq/publisher.js';
import logger from '../../logger.js';

export default {
  createBackup: async ({ id, description }) => {
    try {
      logger.info('inside create backup');
      const websiteToBackup = await Website.findById(new mongoose.Types.ObjectId(id)).exec();
      if (!websiteToBackup) {
        return { success: false, message: 'Website not found' };
      }
      if (websiteToBackup.backups.length === websiteToBackup.maxBackups) {
        return { success: false, message: 'This website is already backed up' };
      }
      const backupWebsiteData = {
        ...websiteToBackup.toObject(),
        status: 'backup',
        _id: undefined,
        backups: [],
      };
      const backupWebsite = await new Website(backupWebsiteData).save();
      const backup = await new Backup({
        siteId: websiteToBackup.id,
        backupSiteId: backupWebsite.id,
        description,
      }).save();
      websiteToBackup.backups.push(backup);
      websiteToBackup.ImportantMessages = ' ';
      await websiteToBackup.save();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  createBackupForQueue: async (id, description) => {
    try {
      const websiteToBackup = await Website.findById(id).exec();
      if (!websiteToBackup) return { success: false, message: 'Website not found' };
      if (websiteToBackup.backups.length === websiteToBackup.maxBackups) return { success: false, message: 'This website is already backed up' };
      websiteToBackup.ImportantMessages = 'inProcess';
      await websiteToBackup.save();
      publish('createBackup', { id, description });
      return { success: true, message: websiteToBackup };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  getSitaBackups: async (id) => {
    const websiteToBackup = await Website.backups.find({
      _id: id,
    });
    return { success: true, message: websiteToBackup };
  },

};
