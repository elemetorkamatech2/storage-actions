const express = require('express');

const router = express.Router();
const {
  createBackup,
} = require('../controllers/backupController');

router.post('/:id', createBackup);
module.exports = router;
