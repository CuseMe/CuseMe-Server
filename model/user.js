//uuid를 통해서 signin하고 token발급
let moment = require('moment');
const jwtExt = require('../modules/security/jwt-ext');
const jwt = require('../modules/security/jwt');
const authUtil = require('../modules/utils/authUtil');
const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/security/db/pool');
//const {ParameterError} = require('../errors');
const error = require('../errors');

const TABLE = 'user';
const NAME = "사용자";

module.exports = {
    start: async(id) => {
        if(!id) throw new error.ParameterError;
        const getQuery = `SELECT * FROM card WHERE uuid = ?`;
        const getValues = [id];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        //console.log('getResult@@@',getResult)
        //if(getResult.length == 0) throw new NotFoundError(NAME);
        if(getResult.length == 0){ 
            const salt = await encryptionManager.makeRandomByte();
            const hashedPassword = encryptionManager.encryption('0000', salt); 
            const postQuery = `INSERT INTO ${TABLE}(uuid, password, salt, phoneNum) VALUES (?, ?, ?, 0)`; 
            const postValues = [id, hashedPassword, salt];
            const postResult = await db.queryParam_Parse(postQuery, postValues);
            const postCardValues = [{title:"text"},{content:"text"},{image:"text"},{record:"text"},{count: 1},{visible: 1},{serialNum:"text"},{sequence: 0},{uuid: 00000}];
            for (var i=0; i<4; i++) {
                const postCardQuery = `INSERT INTO CARD(title, content, image, record, count, visible, serialNum, sequence,  uuid) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ${getValues})`;
                const postCardValue= [postCardValues[i].title, postCardValues[i].content, postCardValues[i].image, postCardValues[i].record, postCardValues[i].count, postCardValues[i].visible, postCardValues[i].serialNum, postCardValues[i].sequence]; 
            }
            const cardResult = await db.queryParam_Parse(postCardQuery,postCardValues);
            if(postResult.affectedRows == 0) throw new error.NotUpdatedError(NAME);
        }
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
        const putQuery = `UPDATE ${TABLE} SET password = ?,salt = ? WHERE uuid = ?`;
        const newSalt = await encryptionManager.makeRandomByte();
        const hashedNewPassword = await encryptionManager.encryption(newPassword, newSalt);
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
        const putQuery = `UPDATE ${TABLE} SET phoneNum = ? WHERE uuid = ?`;
        const putValue = [phoneNum, uuid];
        const putResult = await db.queryParam_Parse(putQuery, putValue);
        return putResult;
    }
    
}
