const statusCode = require('../modules/utils/statusCode');
const responseMessage = require('../modules/utils/responseMessage');

class NotDeletedError extends Error {
    constructor(code = 'GENERIC', status = statusCode.DB_ERROR, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotDeletedError);
        }
        this.code = code;
        this.status = status;
        this.message = responseMessage.CARD_DELETE_FAIL;
    }
}

module.exports = NotDeletedError;