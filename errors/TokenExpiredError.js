const statusCode = require('../modules/utils/statusCode');
const responseMessage = require('../modules/utils/responseMessage');

class TokenExpiredError extends Error {
    constructor(code = 'GENERIC', status = statusCode.UNAUTHORIZED, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, TokenExpiredError);
        }
        this.code = code;
        this.status = status;
        this.message = responseMessage.UNAUTHORIZED;
    }
}

<<<<<<< HEAD
module.exports = TokenExpiredError;
=======
module.exports = TokenExpiredError;
>>>>>>> 4114d11cd60886e4673c2b8dc9e2fb14b9c38c38
