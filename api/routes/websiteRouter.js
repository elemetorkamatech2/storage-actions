const express = require('express');
// const { myFunction } = require('../models/permission-check');

const router = express.Router();
const { createWebsite } = require('../controller/websiteControler');

router.post('/website', createWebsite);
module.exports = router;
