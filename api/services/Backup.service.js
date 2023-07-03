/* eslint-disable quotes */

import mongoose from 'mongoose';
// eslint-disable-next-line no-unused-vars
import { ObjectId } from 'mongodb';
import Backup from '../models/backupModel.js';

import Website from '../models/websiteModel.js';

import publish from '../../rabbitmq/publisher.js';

export default {
  createBackup: async (id) => {
    try {
      const websiteToBackup = await Website.findById(new mongoose.Types.ObjectId(id)).exec();
      if (!websiteToBackup) {
        return { success: false, message: 'Website not found' };
      }
      if (websiteToBackup.backups.length > 0) {
        return { success: false, message: 'This website is already backed up' };
      }
      const backupWebsiteData = {
        ...websiteToBackup.toObject(),
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
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
  createBackupForQueue: async (id) => {
    try {
      const websiteToBackup = await Website.findById(id).exec();
      if (!websiteToBackup) return { success: false, message: 'Website not found' };
      if (websiteToBackup.backups.length > 0) return { success: false, message: 'This website is already backed up' };
      websiteToBackup.ImportantMessages = 'inProcess';
      await websiteToBackup.save();
      // eslint-disable-next-line object-curly-spacing, quote-props
      publish('BackupCreationQueue', {"id": id });
      return { success: true, message: websiteToBackup };
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};
