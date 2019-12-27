const express = require('express');
const router = express.Router({mergeParams: true});
const AuthControllers = require('../controllers/userController');
const authUtil = require('../modules/utils/authUtil');

router.get('/start',AuthControllers.start);
router.get('/signIn', AuthControllers.signIn);
router.put('/',AuthControllers.updatePwd)
router.put('/phone', AuthControllers.updatePhone);

module.exports = router;