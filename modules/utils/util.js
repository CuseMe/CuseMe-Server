const util = {
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
    }
};

module.exports = util;