//토큰 발급, 로그인(보호자 모드로 넘어감), 비밀번호 수정
const User = require('../model/user');
const {
    util,
    status,
    message
} = require('../modules/utils');

module.exports = {
    start: async (req, res) => {
        User.start(req.body.uuid)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.USER_START_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message))})
    },
    signIn: async (req, res) => {
        User.signIn(req.body.uuid, req.body.password)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.SIGN_IN_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message))})
    },
    updatePwd:(req, res)=>{
        User.updatePwd(req.body, req.headers.token)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.PWD_UPDATE_SUCCESS)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message))})
    },
    updatePhone: async (req, res) => {
        User.updatePhone(req.body, req.headers.token)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.PHONE_NUM_UPDATE_SUCCESS)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message))})
    },
    refresh: async (req, res) => {
        User.refreshToken(req.body)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.REFRESH_TOKEN_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message))})
    }
}