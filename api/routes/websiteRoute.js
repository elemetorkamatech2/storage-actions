const express = require('express');
//const { permissionCheck } = require('../models/permission-check.js');
const router = express.Router();
const { createWebsite } = require('../controller/websiteControler');

router.post('/website', createWebsite);

module.exports = router;