import express from 'express';
import controller from '../controllers/websiteController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/website', auth, controller.createWebsite);

export default router;
