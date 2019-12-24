const express = require('express'); 
const router = express.Router({mergeParams: true});

router.use('/', require('./card'))

module.exports = router;