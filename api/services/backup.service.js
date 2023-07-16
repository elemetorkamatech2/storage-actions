/* eslint-disable quotes */
import mongoose from 'mongoose';
import Backup from '../models/backupModel.js';
import Website from '../models/websiteModel.js';
import publish from '../../rabbitmq/publisher.js';
import logger from '../../logger.js';
import { errorMessages, websiteStatuses, queuesNames } from '../../enums.js';

export default {
  createBackup: async ({ id, description }) => {
    try {
      logger.info('inside create backup');
      const websiteToBackup = await Website.findById(new mongoose.Types.ObjectId(id)).exec();
      if (!websiteToBackup) {
        return { success: false, message: errorMessages.WEBSITE_NOT_FOUND };
      }
      if (websiteToBackup.backups.length === websiteToBackup.maxBackups) {
        return { success: false, message: 'This website is already backed up' };/// change to delete the first backup
      }
      const backupWebsiteData = {
        ...websiteToBackup.toObject(),
        status: websiteStatuses.BACKUP,
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
      if (!websiteToBackup) return { success: false, message: errorMessages.WEBSITE_NOT_FOUND };
      // change to delete the first backup - like before
      if (websiteToBackup.backups.length === websiteToBackup.maxBackups) return { success: false, message: 'This website is already backed up' };
      websiteToBackup.ImportantMessages = 'inProcess';
      await websiteToBackup.save();
      publish(queuesNames.CREATE_BACKUP, { id, description });
      return { success: true, message: websiteToBackup };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};
