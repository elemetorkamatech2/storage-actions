const express = require('express');
const { myFunction } = require('../models/permission-check.js');

const router = express.Router();
const { createWebsite } = require('../controller/websiteControler');
router.post('/website',myFunction, createWebsite);
module.exports = router;
