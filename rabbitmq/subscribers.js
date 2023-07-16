import subscribe from './subscriber.js';
import websiteService from '../api/services/website.service.js';
import backupService from '../api/services/backup.service.js';
import { queuesNames } from '../enums.js';

export default () => {
  subscribe(queuesNames.DELETE_WEBSITE, websiteService.endDeletion);
  subscribe(queuesNames.CREATE_BACKUP, backupService.createBackup);
  subscribe(queuesNames.CREATE_WEBSITE, websiteService.createWebsite);
  subscribe(queuesNames.CHANGE_STATUS, websiteService.subscribeChangeStatus);
};
