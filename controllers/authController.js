//로그인 정보 
const User = require('../model/user');
const { util, status, message} = require('../modules/utils');
const NAME = '사용자'; 

module.exports = {
    signIn: async(req, res) => 
        User.signIn(req.body)
        .then((token) =>
            res.status(status.OK)
            .send(util.successTrue(message.LOGIN_SUCCESS,token)))
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
}