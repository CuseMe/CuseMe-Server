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

module.exports = AuthorizationError;