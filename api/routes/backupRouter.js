/* eslint-disable linebreak-style */
import express from 'express';
import backupController from '../controllers/backupController.js';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post('/backup/:id', auth, backupController.createBackup);
router.post('/backups/:id', auth, backupController.restoredForQueue);
export default router;
