const jwtExt = require('../modules/security/jwt-ext');
const jwt = require('../modules/security/jwt');
const authUtil = require('../modules/utils/authUtil');
const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/security/db/pool');
const error = require('../errors');

const {LoggedIn} = require('../modules/utils/authUtil');

const TABLE = 'user';
const NAME = "사용자";

module.exports = {
    start: async(uuid) => {
        if(!uuid) throw new error.ParameterError;
        const getQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const getValues = [uuid];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0){
            const salt = await encryptionManager.makeRandomByte();
            const hashedPassword = encryptionManager.encryption('0000', salt);
            const postQuery = `INSERT INTO ${TABLE}(uuid, password, salt, phoneNum) VALUES (?, ?, ?, 0)`;
            const postValues = [id, hashedPassword, salt];
            const postResult = await db.queryParam_Parse(postQuery, postValues);
            if(postResult.affectedRows == 0) throw new error.NotUpdatedError(NAME);
            return postResult;
        }
        return getResult;
    },
    signIn: async (uuid) => {
        if(!uuid) throw new error.ParameterError
        const query = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const values = [uuid];
        const result = await db.queryParam_Parse(query, values);
        if(result.length == 0) throw new error.NotFoundError(NAME);
        const jwtToken = jwtExt.publish({uuid});
        return {token :jwtToken.token};
    },
    //사용자 비밀번호 수정
    updatePwd : async ({
        password,
        newPassword
    }, token) => {
        if(!password) throw new error.ParameterError;
        const uuid = jwtExt.verify(token).data.id;
        const getQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const getValues = [uuid];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new error.AuthorizationError(NAME);
        const user = getResult[0]
        const salt = user.salt
        const hashedPassword = await encryptionManager.encryption(password, salt);
        if(user.password != hashedPassword) throw new error.MissPasswordError;
        const newSalt = await encryptionManager.makeRandomByte();
        const hashedNewPassword = await encryptionManager.encryption(newPassword, newSalt);
        const putQuery = `UPDATE ${TABLE} SET password = ?,salt = ? WHERE uuid = ?`;
        const putValues = [hashedNewPassword, newSalt, uuid];
        const putResult = await db.queryParam_Parse(putQuery, putValues);
        if(putResult.affectedRows == 0) throw new error.NotUpdatedError(NAME);
        return putResult;
    },
    //사용자 전화번호 변경
    updatePhone: async ({phoneNum}, token) => {
        console.log(phoneNum);
        if(!phoneNum) throw new ParameterError;
        const uuid = jwtExt.verify(token).data.id;
        const query = `UPDATE ${TABLE} SET phoneNum = ? WHERE uuid = ?`;
        const value = [phoneNum, uuid];
        const result = await db.queryParam_Parse(query, value);
        return result;
    }
}
