const express = require('express'); 
const router = express.Router({mergeParams: true});

router.use('/', require('./card'));

console.log('/card');

module.exports = router;