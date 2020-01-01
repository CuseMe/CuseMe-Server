const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/security/db/pool');
const error = require('../errors');
const crypto = require('crypto');
const TABLE = 'user';
const OWN_TABLE = 'own';

module.exports = {
    start: async(uuid) => {
        if(!uuid) throw new error.ParameterError;
        const findUserQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const findUserValues = [uuid];
        const findUserResult = await db.queryParam_Parse(findUserQuery, findUserValues);
        if (findUserResult.length == 0 || !findUserResult) {
            const salt = (await crypto.randomBytes(32)).toString('hex');
            const hashedPassword = encryptionManager.encryption('0000', salt);
            const userInsertQuery = `INSERT INTO ${TABLE}(uuid, password, salt) VALUES (?, ?, ?)`;
            const userInsertValues = [uuid, hashedPassword, salt];
            const userInsertResult = await db.queryParam_Parse(userInsertQuery, userInsertValues);
            let userIdx = userInsertResult.insertId;
            for (var i = 0; i < 4; i++) {
                const postQuery = `INSERT INTO ${OWN_TABLE}(cardIdx, userIdx) VALUES(?, ?)`;
                let postValues = [i, userIdx];
                const postResult = await db.queryParam_Parse(postQuery, postValues);
                if(postResult.affectedRows == 0) throw new error.NotUpdatedError;
            }
        }
    },
    signIn: async (uuid, password) => {
        if(!uuid || !password) throw new error.ParameterError;
        const findUserQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const findUserValues = [uuid];
        const findUserResult = await db.queryParam_Parse(findUserQuery, findUserValues);
        if (findUserResult.length == 0 || !findUserResult) throw new error.NoUserError;
        const user = findUserResult[0];
        const salt = user.salt;
        const userIdx = user.userIdx;
        const hashedPassword = await encryptionManager.encryption(password, salt);
        if(user.password != hashedPassword) throw new error.MissPasswordError;
        const jwtToken = jwtExt.publish({userIdx, uuid});
        return {token :jwtToken.token};
    },
    updatePwd : async ({
        password,
        newPassword
    }, token) => {
        if(!password || !newPassword) throw new error.ParameterError;
        const userIdx = jwtExt.verify(token).data.userIdx;
        const getQuery = `SELECT * FROM ${TABLE} WHERE userIdx = ?`;
        const getValues = [userIdx];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new error.NoUserError;
        const user = getResult[0]
        const salt = user.salt
        const hashedPassword = await encryptionManager.encryption(password, salt);
        if(user.password != hashedPassword) throw new error.MissPasswordError;
        const newSalt = await encryptionManager.makeRandomByte();
        const hashedNewPassword = await encryptionManager.encryption(newPassword, newSalt);
        const putQuery = `UPDATE ${TABLE} SET password = ?, salt = ? WHERE userIdx = ?`;
        const putValues = [hashedNewPassword, newSalt, userIdx];
        const putResult = await db.queryParam_Parse(putQuery, putValues);
        if(putResult.affectedRows == 0) throw new error.NotUpdatedError;
        return putResult;
    },
    updatePhone: async ({phoneNum}, token) => {
        console.log(phoneNum);
        if(!phoneNum) throw new ParameterError;
        const userIdx = jwtExt.verify(token).data.userIdx;
        const query = `UPDATE ${TABLE} SET phoneNum = ? WHERE userIdx = ?`;
        const value = [phoneNum, userIdx];
        const result = await db.queryParam_Parse(query, value);
        return result;
    }
}
