
const express = require('express')
const router = express.Router()
const {
    createBackup ,
} = require('../controller/backupControler');
router.post('/:id', createBackup);
module.exports = router;
