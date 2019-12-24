const statusCode = require('../modules/utils/statusCode');
const responseMessage = require('../modules/utils/responseMessage');

class NoReferencedRowError extends Error {
    constructor(code = 'GENERIC', status = statusCode.BAD_REQUEST, ...params) {
        super(...params);
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, NoReferencedRowError);
        }
        this.code = code;
        this.status = status;
        this.message = responseMessage.DB_REFERENCE_ERROR;
    }
}

<<<<<<< HEAD
module.exports = NoReferencedRowError;
=======
module.exports = NoReferencedRowError;
>>>>>>> 4114d11cd60886e4673c2b8dc9e2fb14b9c38c38
