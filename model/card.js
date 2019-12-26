const pool = require('../modules/security/db/pool');
const cardData = require('../modules/data/cardData');
const jwtExt = require('../modules/security/jwt-ext');

const { 
    AuthorizationError, 
    ParameterError,
    NotCreatedError,
    NotDeletedError,
    NotFoundError,
    NotUpdatedError
} = require('../errors');

const TABLE = 'card';

const card = {
    read: async (cardIdx) => {
        const query = `SELECT * FROM ${TABLE} WHERE cardIdx = ${cardIdx}`;
        const values = [cardIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.length == 0) throw new NotFoundError;
        const card = cardData(result[0]);
        return card;
    },
    readAll: async () => {
        const query = `SELECT * FROM ${TABLE}`;
        const result = await pool.queryParam_None(query);
        if(result.length == 0) throw new NotFoundError;
        return result.map(cardData);
    },
    count: async (cardIdx) => {
        const query = `UPDATE ${TABLE} SET count = count + 1 WHERE cardIdx = ${cardIdx}`;
        const values = [cardIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.affectedRows == 0) throw new NotFoundError;
    },
    create: async (
        {image,
        record},
        {title,
        content,
        visible,
        uuid,
        sequence}) => {
            if(!image || !title || !content || !visible || !uuid || !sequence) throw new ParameterError
            const serialNum = Math.random().toString(36).substring(3);
            const query = `INSERT INTO ${TABLE}(title, content, image, record, visible, serialNum, uuid, sequence) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`
            const values = [title, content, image[0].location, record[0].location, visible, serialNum, uuid, sequence]
            const result = await pool.queryParam_Parse(query, values);
            if(result.affectedRows == 0) throw new NotCreatedError
    },
    update: async (
        {image,
        record},
        {title,
        content,
        visible,
        uuid},
        cardIdx) => {
            if(!image || !title || !content || !visible || !uuid ) throw new ParameterError
            const query = `UPDATE ${TABLE} SET image = ?, record = ?, title = ?, content = ?, visible = ? WHERE uuid = ? AND cardIdx = ?`;
            const values = [image[0].location, record[0].location, title, content, visible, uuid, cardIdx]
            console.log('values',values)
            const result = await pool.queryParam_Parse(query, values);
            if(result.affectedRows == 0) throw new NotUpdatedError
    },
    updateAll: async() => {
        //TODO: 카드 배열 및 전체 수정
    },
    delete: async ({cardIdx}, token) => {
        const user = jwtExt.verify(token).data.userIdx
        const verifyQuery = `SELECT * FROM ${TABLE} WHERE cardIdx = ? AND userIdx = ?`;
        const verifyValues = [cardIdx, user];
        const verifyResult = await pool.queryParam_Parse(verifyQuery, verifyValues);
        if(verifyResult.length == 0) throw new AuthorizationError();
        const deleteQuery = `DELETE FROM ${TABLE} WHERE cardIdx = '${cardIdx}'`;
        const deleteResult = await pool.queryParam_None(deleteQuery);
        if(deleteResult.affectedRows == 0) throw new NotDeletedError();
        return deleteResult;
    }
}

module.exports = card