import express from 'express';
import controller from '../controllers/websiteController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/website', auth, controller.createWebsite);
router.get('/website', auth, controller.getAll);
router.get('/website/:id', auth, controller.getById);
router.put('/website', auth, controller.put);

export default router;
