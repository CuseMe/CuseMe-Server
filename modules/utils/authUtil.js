const jwt = require('../security/jwt');
const resMessage = require('./responseMessage');
const statusCode = require('./statusCode');
const util = require('./util');

const authUtil = {
    successTrue: (status, message, data) => { 
        return {
            status: status,
            success: true,
            message: message, 
            data: data
        } 
    },
    successFalse: (status, message, data) => { 
        return {
            status: status,
            success: false,
            message: message,
            data: data
        }
    }, 
    LoggedIn: async(req, res, next) => {
        console.log("미들 웨어");
        var token = req.headers.token;
        if(!token){
            return res.status(statusCode.BAD_REQUEST).
            send(util.successFalse(statusCode.BAD_REQUEST, resMessage.EMPTY_TOKEN, []))
        }
        const result = jwt.verify(token); 
        console.log(result);
        if(result == -1) {
            return res.status(statusCode.UNAUTHORIZED)
            .send(util.successFalse(statusCode.UNAUTHORIZED, resMessage.EXPIRED_TOKEN, [])); 
        }
        if(result == -2) {
            return res.status(statusCode.UNAUTHORIZED)
            .send(util.successFalse(statusCode.UNAUTHORIZED, resMessage.INVALID_TOKEN, [])); 
        }
        const userIdx = result.idx;
        req.decoded = userIdx;
        next();
    }
}
module.exports = authUtil;