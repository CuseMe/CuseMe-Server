//uuid를 통해서 signin하고 token발급
let moment = require('moment');
const jwtExt = require('../modules/security/jwt-ext');
const jwt = require('../modules/security/jwt');
const authUtil = require('../modules/utils/authUtil');
const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/security/db/pool');
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
            const salt = await encryptionManager.makeRandomByte();
            const hashedPassword = encryptionManager.encryption('0000', salt);
            const insertQuery = `INSERT INTO ${TABLE}(uuid, password, salt, phoneNum) VALUES (?, ?, ?, 0)`;
            const insertValues = [id, hashedPassword, salt];
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
        return {token :jwtToken.token};
    },

    //사용자 비밀번호 수정
    updatePwd : async ({
        password,
        newpassword
    }, token) => {
        if(!password) throw new error.ParameterError;
        const uuid = jwtExt.verify(token).data.id;
        const getQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const getValues = [uuid];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new error.AuthorizationError(NAME);
        
        const salt = getResult[0].salt;
       // const hashedpassword = getResult[0].password;
        let decoded = jwt.verify(password, salt); //0000
        console.log(decoded)

        const hashedPassword = await encryptionManager.encryption(password, salt);
        if(getResult[0].password != hashedPassword) throw new error.MissPasswordError;
        const putQuery = `UPDATE ${TABLE} SET password = ?,salt = ? WHERE uuid = ?`;
        const newsalt = await encryptionManager.makeRandomByte();
        const hashednewpassword = await encryptionManager.encryption(newpassword, newsalt);
        const putValues = [hashednewpassword, newsalt, uuid];
        const putResult = await db.queryParam_Parse(putQuery, putValues);
        if(putResult.affectedRows == 0) throw new error.NotUpdatedError(NAME);
    },

    // })

    //사용자 전화번호 변경
    updatePhone: async ({phoneNum}, token) => {
        console.log(phoneNum);
        if(!phoneNum) throw new ParameterError;
        const uuid = jwtExt.verify(token).data.id;
        const putQuery = `UPDATE ${TABLE} SET phoneNum = ? WHERE uuid = ?`;
        const putValue = [phoneNum, uuid];
        const putResult = await db.queryParam_Parse(putQuery, putValue);
        return putResult;
    }
    
}
