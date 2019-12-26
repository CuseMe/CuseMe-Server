//토큰 발급, 로그인(보호자 모드로 넘어감), 비밀번호 수정
const User = require('../model/user');
const { util, status, message} = require('../modules/utils');
const NAME = '사용자'; 
const jwt = require('../modules/security/jwt');
const authUtil = require('../modules/utils/authUtil');

module.exports = {
    //start: async(req, res) => {}
    //앱 시작 시 바디로 받은 uuid 가지고 토큰 생성
    //jwt의 sign
    start: async(req, res) => {
        //const id = req.body
        User.start(req.body.id)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.USER_START_SUCCESS, result))
        )
        .catch(err => {
            console.log(err);
            res.status(err.status || 500)
                .send(util.successFalse(err.message))
        })
    },
    signIn: async(req, res) => {
        User.signIn(req.body.id)
        .then(result => 
            res.status(status.OK)
            .send(util.successTrue(message.SIGN_IN_SUCCESS, result))
        )
        .catch(err => {
            console.log(err);
            res.status(err.status || 500)
                .send(util.successFalse(err.message))
        })
    },
    updatePwd: async(req, res) => {
        //TODO: 사용자 비밀번호 수정
        User.updatePwd(req.body, req.headers.token) 
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(message.X_UPDATE_SUCCESS(NAME))))
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    }
}