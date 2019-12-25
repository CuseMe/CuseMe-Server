const statusCode = require('../modules/utils/statusCode');
const responseMessage = require('../modules/utils/responseMessage');

class NotFoundError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotFoundError);
        }
        this.code = code;
        this.status = status;
        this.message = responseMessage.NO_CARD;
    }
}

module.exports = NotFoundError;
