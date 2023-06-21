const express = require('express');
const { createWebsite } = require('../controllers/websiteController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/website', auth, createWebsite);

module.exports = router;
