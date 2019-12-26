const express = require('express');
const router = express.Router({mergeParams: true});
const AuthControllers = require('../controllers/userController');

router.get('/start',AuthControllers.start);
router.get('/signIn', AuthControllers.signIn);
module.exports = router;