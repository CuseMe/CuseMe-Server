const statusCode = require('../modules/utils/statusCode');
const responseMessage = require('../modules/utils/responseMessage');

class NotCreatedError extends Error {
    constructor(code = 'GENERIC', status = statusCode.DB_ERROR, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotCreatedError);
        }
        this.code = code;
        this.status = status;
        this.message = responseMessage.CARD_CREATE_FAIL;
    }
}

module.exports = NotCreatedError;