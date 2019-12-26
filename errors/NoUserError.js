const statusCode = require('../modules/utils/statusCode');
const responseMessage = require('../modules/utils/responseMessage');

class NoUserError extends Error {
    constructor(code = 'GENERIC', status = statusCode.UNAUTHORIZED, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoUserError);
        }
        this.code = code;
        this.status = status;
        this.message = responseMessage.NO_USER;
    }
}

module.exports = NoUserError;
