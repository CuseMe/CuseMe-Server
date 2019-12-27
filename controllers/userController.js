//토큰 발급, 로그인(보호자 모드로 넘어감), 비밀번호 수정
const User = require('../model/user');
const {
    util,
    status,
    message
} = require('../modules/utils');
const NAME = '사용자';
const jwt = require('../modules/security/jwt');
const authUtil = require('../modules/utils/authUtil');

module.exports = {
    start: async (req, res) => {
        User.start(req.body.uuid)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.USER_START_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.message))})
    },
    signIn: async (req, res) => {
        User.signIn(req.body.uuid)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.SIGN_IN_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.message))})
    },
    updatePwd: async (req, res) => {
        console.log("req.body.password",req.body);
        User.updatePwd(req.body, req.headers.token)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(message.PWD_UPDATE_SUCCESS))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.message))}))
    },
    updatePhone: async (req, res) => {
        User.updatePhone(req.body, req.headers.token)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(message.PHONE_NUM_UPDATE_SUCCESS)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.message))})
    }
}