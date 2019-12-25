const express = require('express');
const router = express.Router({mergeParams: true});
const AuthControllers = require('../controllers/userController');

router.get('/signin',AuthControllers.signIn);

module.exports = router;