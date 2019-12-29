const jwtExt = require('../modules/security/jwt-ext');
const jwt = require('../modules/security/jwt');
const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/security/db/pool');
const error = require('../errors');
const crypto = require('crypto');
const TABLE = 'user';

module.exports = {
    start: async(uuid) => {
        const findUserQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const findUserValues = [uuid];
        const findUserResult = await db.queryParam_Parse(findUserQuery, findUserValues);
        const phoneNum = '000000000000'
        if (findUserResult.length == 0 || !findUserResult) {
            const salt = (await crypto.randomBytes(32)).toString('hex');
            const hashedPassword = encryptionManager.encryption('0000', salt);
            const userInsertQuery = `INSERT INTO ${TABLE}(uuid, password, salt, phoneNum) VALUES (?, ?, ?, ?)`;
            const userInsertValues = [uuid, hashedPassword, salt, phoneNum];
            const userInsertResult = await db.queryParam_Parse(userInsertQuery, userInsertValues);
            let userIdx = userInsertResult.insertId;
            for (var i = 12; i < 15; i++) {
                const postQuery = `INSERT INTO own (cardIdx, userIdx) VALUES(?, ?)`;
                let postValues = [i, userIdx]
                const postResult = await db.queryParam_Parse(postQuery, postValues);
                console.log(postResult)
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
    //사용자 비밀번호 수정
    updatePwd : async ({
        password,
        newPassword
    }, token) => {
        console.log(password, newPassword)
        if(!password || !newPassword) throw new error.ParameterError;
        const uuid = jwtExt.verify(token).data.uuid;
        const getQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const getValues = [uuid];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new error.NoUserError;
        const user = getResult[0];
        const salt = user.salt;
        const hashedPassword = await encryptionManager.encryption(password, salt);
        if(user.password != hashedPassword) throw new error.MissPasswordError;
        const newSalt = await encryptionManager.makeRandomByte();
        const hashedNewPassword = await encryptionManager.encryption(newPassword, newSalt);
        const putQuery = `UPDATE ${TABLE} SET password = ?, salt = ? WHERE uuid = ?`;
        const putValues = [hashedNewPassword, newSalt, uuid];
        const putResult = await db.queryParam_Parse(putQuery, putValues);
        if(putResult.affectedRows == 0) throw new error.NotUpdatedUserError;
        return putResult;
    },
    
    updatePhone: async ({phoneNum}, token) => {
        if(!phoneNum) throw new ParameterError;
        const uuid = jwtExt.verify(token).data.uuid;
        const query = `UPDATE ${TABLE} SET phoneNum = ? WHERE uuid = ?`;
        const value = [phoneNum, uuid];
        const result = await db.queryParam_Parse(query, value);
        return result;
    }
}
