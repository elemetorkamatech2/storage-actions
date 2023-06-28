const express = require('express');
const { createWebsite, getAll, getById } = require('../controllers/websiteController');
const auth = require('../middlewares/auth');

const router = express.Router();
router.post('/website', auth, createWebsite);
router.get('/website', auth, getAll);
router.get('/website/:id', auth, getById);

module.exports = router;
