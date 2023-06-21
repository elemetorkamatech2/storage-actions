const express = require('express');
const { createWebsite } = require('../controller/websiteControler');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/website', auth, createWebsite);

module.exports = router;
