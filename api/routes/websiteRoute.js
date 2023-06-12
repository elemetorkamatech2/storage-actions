const express = require('express');
const router = express.Router();
const { createWebsite } = require('../controller/websiteControler');

router.post('/website', createWebsite);

module.exports = router;