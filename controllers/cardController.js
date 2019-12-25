//카드 정보
const Card = require('../model/card');
const { util, status, message} = require('../modules/utils');
const NAME = '카드'; 

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