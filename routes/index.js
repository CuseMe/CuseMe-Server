const express = require('express');
const router = express.Router();

router.use('/cards', require('./card'));
router.use('/auth', require('./user'));

console.log("baseUri/");

module.exports = router;
