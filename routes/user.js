const express = require('express');
const router = express.Router({mergeParams: true});
const AuthControllers = require('../controllers/userController');

router.get('/login',AuthControllers.start);

module.exports = router;