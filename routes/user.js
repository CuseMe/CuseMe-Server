const express = require('express');
const router = express.Router({mergeParams: true});
const {LoggedIn} = require('../modules/utils/authUtil');
//토큰 발급, 로그인(보호자 모드로 넘어감), 비밀번호 수정
const User = require('../controller/user');
const {
    util,
    status,
    message
} = require('../modules/utils');

router.post('/start', (req, res) =>
    User.start(req.body.uuid)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.USER_START_SUCCESS, result)))
    .catch(err => {
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message))}));
router.post('/signIn', (req, res) => 
    User.signIn(req.body.uuid, req.body.password)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.SIGN_IN_SUCCESS, result)))
    .catch(err => {
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message))}));
router.put('/', LoggedIn, (req, res)=>
    User.updatePwd(req.body, req.headers.token)
    .then(() =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.PWD_UPDATE_SUCCESS)))
    .catch(err => {
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message))}))
router.put('/phone', LoggedIn,(req, res) =>
    User.updatePhone(req.body, req.headers.token)
    .then(() =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.PHONE_NUM_UPDATE_SUCCESS)))
    .catch(err => {
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message))}));

module.exports = router;