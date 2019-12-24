//uuid를 통해서 signin하고 token발급
//let moment = require('moment');
const jwtExt = require('../modules/security/jwt-ext');
const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/db/pool');
const { 
    ParameterError} = require('../errors');
const TABLE = 'user';
const NAME = "사용자";

module.exports = {
    signIn: async ({
        id
    }) => {
        if(!id) throw new ParameterError
        const getQuery = `SELECT * FROM ${TABLE} WHERE userId = ?`;
        const getValues = [id];
        const getResult = await db.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new NotFoundError(NAME);
        const jwtToken = jwtExt.publish({id});
        return {token :jwtToken.token}
    }
}
