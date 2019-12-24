const User = require('../model/user');
const { util, status, message} = require('../modules/utils');
const NAME = '사용자'; 

module.exports = {
    signUp: async(req, res) => 
        User.signUp(req.body)
        .then(() => 
            res.status(status.OK)
            .send(util.successTrue(message.SIGNUP_SUCCESS)))
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    ,
    signIn: async(req, res) => 
        User.signIn(req.body)
        .then((token) =>
            res.status(status.OK)
            .send(util.successTrue(message.LOGIN_SUCCESS,token)))
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
            
}