//uuid를 통해서 signin하고 token발급
//let moment = require('moment');
const jwtExt = require('../modules/security/jwt-ext');
const jwt = require('../modules/security/jwt');
const authUtil = require('../modules/utils/authUtil');
const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/db/pool');
const { ParameterError} = require('../errors');
const TABLE = 'user';
const NAME = "사용자";

module.exports = {
    start: async(id) => {
        if(!id) throw new ParameterError;
        const getQuery = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const getValues = [id];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        //if(getResult.length == 0) throw new NotFoundError(NAME);
        if(getResult.length == 0){
            const insertQuery = `INSERT INTO ${TABLE}(uuid, password, salt, phoneNum) VALUES (?, 0000, 1234, 0)`;
            const insertValues = [id];
            const insertResult = await db.queryParam_Parse(insertQuery, insertValues);
            return insertResult;
        }
        return getResult;
    },
    signIn: async (id) => {
        if(!id) throw new ParameterError
        const getQuery = `SELECT * FROM ${TABLE} WHERE userId = ?`;
        const getValues = [id];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new NotFoundError(NAME);
        const jwtToken = jwtExt.publish({id});
        return {token :jwtToken.token}
    },
    //사용자 비밀번호 수정
    // update: async({

    // })
}
