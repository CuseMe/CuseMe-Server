let moment = require('moment');
const jwtExt = require('../modules/security/jwt-ext');
const encryptionManager = require('../modules/security/encryptionManager');
const db = require('../modules/db/pool');
const { 
    ParameterError,
    MissPasswordError,
    NotCreatedError,
    NotFoundError,
    NotUpdatedError,
    ExistedUserError,
    NotDeletedError } = require('../errors');
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
        const salt = getResult[0].salt;
        const hashedPassword = await encryptionManager.encryption(pw, salt);
        if(getResult[0].userPw != hashedPassword) throw new MissPasswordError;
        let date = moment(moment().unix()*1000).format("YYYY-MM-DD HH:mm:ss");
        const jwtToken = jwtExt.publish({id,date});
        return {token :jwtToken.token}
    },
    update: async(
        {pw},
        token
    ) => {
        if(!pw) throw new ParameterError;
        let date = moment(moment().unix()*1000).format("YYYY-MM-DD HH:mm:ss");
        const id = jwtExt.verify(token).data.id;
        const jwtToken = jwtExt.publish({id,date}).token;
        const salt = await encryptionManager.makeRandomByte();
        const hashedPassword = await encryptionManager.encryption(pw,salt);
        const putQuery = `UPDATE ${TABLE} SET userPw = ?, salt = ? WHERE userId = ?`;
        const putValues = [hashedPassword, salt, id];
        const putResult = await db.queryParam_Parse(putQuery, putValues);
        if(putResult.affectedRows == 0) throw new NotUpdatedError(NAME);
        return {token: jwtToken}
    },
    remove: async(token) => {
        const id = jwtExt.verify(token).data.id;
        const deleteQuery = `DELETE FROM ${TABLE} WHERE userId = ?`;
        const deleteValues = [id];
        const deleteResult = await db.queryParam_Parse(deleteQuery, deleteValues);
        if(deleteResult.affectedRows == 0) throw new NotDeletedError(NAME);
    }
}
