const express = require('express');
const router = express.Router({mergeParams: true});
const AuthControllers = require('../controllers/userController');
const {LoggedIn} = require('../modules/utils/authUtil');

router.post('/start',AuthControllers.start);
router.post('/signIn', AuthControllers.signIn);
router.get('/refresh', AuthControllers.refresh);
router.put('/', LoggedIn, AuthControllers.updatePwd)
router.put('/phone', LoggedIn, AuthControllers.updatePhone);

module.exports = router;