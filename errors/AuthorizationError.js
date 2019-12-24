const statusCode = require('../modules/utils/statusCode');
const responseMessage = require('../modules/utils/responseMessage');

class AuthorizationError extends Error {
    constructor(name, code = 'GENERIC', status = statusCode.UNAUTHORIZED, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AuthorizationError);
        }
        this.name = name;
        this.code = code;
        this.status = status;
        this.message = responseMessage.UNAUTHORIZED(name);
    }
}

<<<<<<< HEAD
module.exports = AuthorizationError;
=======
module.exports = AuthorizationError;
>>>>>>> 4114d11cd60886e4673c2b8dc9e2fb14b9c38c38
