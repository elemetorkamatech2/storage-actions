import subscribe from './subscriber.js';
import websiteService from '../api/services/website.service.js';

export default subscribe('deleteWebsite', websiteService.fullDelete);
