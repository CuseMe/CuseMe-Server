const statusCode = require('../modules/utils/statusCode');
const responseMessage = require('../modules/utils/responseMessage');

class NotUpdatedUserError extends Error {
    constructor(code = 'GENERIC', status = statusCode.DB_ERROR, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NotUpdatedError);
        }
        this.code = code;
        this.status = status;
        this.message = responseMessage.USER_UPDATE_FAIL;
    }
}

module.exports = NotUpdatedUserError;