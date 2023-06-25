import express from 'express';
import createWebsite from '../controllers/websiteController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/website', auth, () => createWebsite);

export default router;
