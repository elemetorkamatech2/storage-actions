import subscribe from './subscriber.js';
import websiteService from '../api/services/website.service.js';
import backupService from '../api/services/backup.service.js';

export default () => {
  subscribe('deleteWebsite', websiteService.endDeletion);
  subscribe('createBackup', backupService.createBackup);
  subscribe('restoredBackup', backupService.restored);
};
