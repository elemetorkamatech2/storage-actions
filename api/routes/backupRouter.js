/* eslint-disable linebreak-style */
import express from 'express';
import backupController from '../controllers/backupController.js';

const router = express.Router();

router.post('/backup/:id', backupController.createBackup);
router.get('/backup/:id', backupController.getSitaBackups);
export default router;
