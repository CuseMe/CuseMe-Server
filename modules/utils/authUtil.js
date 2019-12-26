// authUtil.js
const jwt = require('../security/jwt');
const responseMessage = require('./responseMessage');
const statusCode = require('./statusCode');
const util = require('./util');

const authUtil = {

    LoggedIn: async(req, res, next) =>{
        const {token} = req.headers;
        //1. 토큰 존재하는지 확인
        if(!token){
            return res.status(statusCode.BAD_REQUEST).send(util.successFalse(responseMessage.EMPTY_TOKEN));
        }
        //2. 토큰 유효한지 확인
        const result = jwt.verify(token);
        if(result == -3){
            res.status(statusCode.UNAUTHORIZED)
            .send(util.successFalse(responseMessage.EXPIRED_TOKEN));
            return;
        }
        if(result == -2){
            res.status(statusCode.UNAUTHORIZED)
            .send(util.successFalse(responseMessage.INVALID_TOKEN));
            return;
        }
        console.log(result);
        const userIdx = result.idx;
        if(!userIdx){
            res.status(statusCode.BAD_REQUEST)
            .send(util.successFalse(responseMessage.NULL_VALUE));
            return;
        }
        req.decoded = userIdx;
        next();
    }

}
module.exports = authUtil;