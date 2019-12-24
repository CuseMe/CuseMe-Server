const express = require('express')
const router = express.Router()

router.use('/auth', require('./auth'))
router.use('/card', require('./card'))

module.exports = router;