//uuid를 통해서 signin하고 token발급
//let moment = require('moment');
const jwtExt = require('../modules/security/jwt-ext');
const jwt = require('../modules/security/jwt');
const authUtil = require('../modules/utils/authUtil');
const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/db/pool');
//const {ParameterError} = require('../errors');
const error = require('../errors');

const {LoggedIn} = require('../modules/utils/authUtil');

const TABLE = 'user';
const NAME = "사용자";


module.exports = {
    start: async(id) => {
        if(!id) throw new error.ParameterError;
        const getQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const getValues = [id];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        //console.log('getResult@@@',getResult)
        //if(getResult.length == 0) throw new NotFoundError(NAME);
        if(getResult.length == 0){
            const insertQuery = `INSERT INTO ${TABLE}(uuid, password, salt, phoneNum) VALUES (?, 1111, 1234, 0)`;
            const insertValues = [id];
            const insertResult = await db.queryParam_Parse(insertQuery, insertValues);
            if(insertResult.affectedRows == 0) throw new error.NotUpdatedError(NAME);
            return insertResult;
        }
        return getResult;
    },
    signIn: async (id) => {
        if(!id) throw new error.ParameterError
        const getQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const getValues = [id];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new error.NotFoundError(NAME);
        const jwtToken = jwtExt.publish({id});
        return {token :jwtToken.token}
    },

    //사용자 비밀번호 수정
    updatePwd : async ({
        password,
        newpassword
    }, token) => {
        if(!password) throw new error.ParameterError;
        console.log('token',token)
        const uuid = jwtExt.verify(token).data.id;
        console.log('jwt',jwtExt.verify(token))
        console.log('uuid',uuid);
        const getQuery = `SELECT * FROM ${TABLE} WHERE password = ? AND uuid = ?`;
        const getValues = [password,uuid];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new error.AuthorizationError(NAME);
        const salt = getResult[0].salt;
        const hashedPassword = await encryptionManager.encryption(password, salt);
        if(getResult[0].userPw != hashedPassword) throw new error.MissPasswordError;
        const putQuery = `UPDATE ${TABLE} SET password = ?,salt = ? WHERE uuid = ?`;
        const newsalt = await encryptionManager.makeRandomByte();
        const hashednewpassword = await encryptionManager.encryption(newpassword, newsalt);
        const putValues = [hashednewpassword, newsalt, uuid];
        const putResult = await db.queryParam_Parse(putQuery, putValues);
        if(putResult.affectedRows == 0) throw new error.NotUpdatedError(NAME);
    }

}
