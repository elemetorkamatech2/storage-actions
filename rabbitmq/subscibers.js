import subscribe from './subscriber.js';
import websiteService from '../api/services/website.service.js';

export default subscribe('create', websiteService.createWebsite);
