const express = require('express');
const router = express.Router({mergeParams: true});
const AuthControllers = require('../controllers/userController');
const {LoggedIn} = require('../modules/utils/authUtil');

router.get('/start',AuthControllers.start);
router.get('/signIn', AuthControllers.signIn);
router.put('/', LoggedIn, AuthControllers.updatePwd)
router.put('/phone', LoggedIn, AuthControllers.updatePhone);

module.exports = router;