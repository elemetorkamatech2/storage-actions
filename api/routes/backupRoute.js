
const express = require('express')

const router = express.Router()

const {
    create,
} = require('../controller/backupControler')

router.post('/:id', create)
module.exports = router