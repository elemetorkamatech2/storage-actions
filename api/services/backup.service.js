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
      logger.info(backupWebsite);
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

  restoredForQueue: async (becendId, user) => {
    try {
      const becend = await Website.findById(becendId);
      // eslint-disable-next-line eqeqeq
      if (user != becend.userId) return { success: false, error: errorMessages.NOT_PERMISSIONS };
      if (!becend) return { success: false, error: errorMessages.BECEND_NOT_FOUND };
      // eslint-disable-next-line max-len
      if (becend.status === websiteStatuses.INACTIVE) return { success: false, error: errorMessages.BECEND_IS_ALREADY_RESTORED };
      // eslint-disable-next-line max-len
      if (becend.status === websiteStatuses.ABOUT_TO_BE_RESTORED) return { success: false, error: errorMessages.BECEND_IS_IN_PROCESS_OF_restored };
      becend.status = websiteStatuses.ABOUT_TO_BE_RESTORED;
      await becend.save();
      publish(queuesNames.CREATE_BECEND, { becendId });
      return { success: true, message: `the website with id: ${becendId} is going to be restored` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  restored: async (message) => {
    try {
      logger.error(message);
      const becend = await Website.findById(message.becend);
      if (!becend) return { success: false, error: errorMessages.BECEND_NOT_FOUND };
      // eslint-disable-next-line max-len
      if (becend.status === websiteStatuses.INACTIVE) return { success: false, error: errorMessages.BECEND_IS_ALREADY_RESTORED };
      becend.status = websiteStatuses.INACTIVE;
      await becend.save();
      return { success: true, message: `the website with id: ${message.websiteId} has been successfully restored` };
    } catch (error) {
      logger.error(error.message);
      return { success: false, error: error.message };
    }
  },
};
