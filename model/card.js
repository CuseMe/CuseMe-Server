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
    read: async (
        cardIdx,
        token) => {
            const uuid = jwtExt.verify(token).data.uuid;
            const query = `SELECT * FROM ${TABLE} WHERE cardIdx = ? AND uuid = ?`;
            const values = [cardIdx, uuid];
            const result = await pool.queryParam_Parse(query, values);
            if(result.length == 0) throw new NotFoundError;
            const card = cardData(result[0]);
            return card;
    },
    readAll: async (token) => {
        const uuid = jwtExt.verify(token).data.uuid;
        const query = `SELECT * FROM ${TABLE} WHERE uuid = ?`;
        const values = [uuid]
        const result = await pool.queryParam_Parse(query,values);
        if(result.length == 0) throw new NotFoundError;
        return result.map(cardData);
    },
    readVisible: async (uuid) => {
        const query = `SELECT * FROM ${TABLE} WHERE uuid = '${uuid}' AND visible = 1`;
        const result = await pool.queryParam_None(query);
        if(result.length == 0) throw new NotFoundError;
        return result.map(cardData);
    },
    count: async (cardIdx, token) => {
        const uuid = jwtExt.verify(token).data.uuid;
        const query = `UPDATE ${TABLE} SET count = count + 1 WHERE cardIdx = ? AND uuid = ?`;
        const values = [cardIdx, uuid];
        const result = await pool.queryParam_Parse(query, values);
        if(result.affectedRows == 0) throw new NotFoundError;
    },
    create: async (
        {image,
        record},
        {title,
        content,
        visible,
        sequence},
        token) => {
            if(!image || !title || !content || !visible || !sequence) throw new ParameterError
            //랜덤 시리얼 번호가 같을 때 재설정이 필요
            const serialNum = Math.random().toString(36).substring(3);
            const uuid = jwtExt.verify(token).data.uuid;
            const query = `INSERT INTO ${TABLE}(title, content, image, record, visible, serialNum, uuid, sequence) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [title, content, image[0].location, record[0].location, visible, serialNum, uuid, sequence];
            const result = await pool.queryParam_Parse(query, values);
            if(result.affectedRows == 0) throw new NotCreatedError;
    },
    download: async (
        token,
        serialNum) => {
            if(!serialNum) throw new ParameterError;
            const uuid = jwtExt.verify(token).data.uuid;
            const getQuery = `SELECT * from ${TABLE} WHERE serialNum = ?`;
            const getValues = [serialNum];
            const getResult = await pool.queryParam_Parse(getQuery, getValues);
            if(getResult.length == 0) throw new NotFoundError;
            console.log("getResult",getResult);
            const serial = Math.random().toString(36).substring(3);
            const postQuery = `INSERT INTO ${TABLE}(title, content, image, record, visible, serialNum, uuid, sequence) VALUES(?, ?, ?, ?, ?, ?, ?, ?)`;
            //sequence 값은 해당 사용자 칼럼 sequence 최대값으로 할 것 현재 더미 데이터로 10
            //serial 값은 그대로 할 것
            const postValues = [getResult[0].title, getResult[0].content, getResult[0].image, getResult[0].record, "1", serial, uuid, "10"];
            const postResult = await pool.queryParam_Parse(postQuery, postValues);
            if(postResult.affectedRows == 0) throw new NotCreatedError;
    },
    update: async (
        {image,
        record},
        {title,
        content,
        visible},
        token,
        cardIdx) => {
            if(!image || !title || !content || !visible ) throw new ParameterError
            const uuid = jwtExt.verify(token).data.uuid;
            const query = `UPDATE ${TABLE} SET image = ?, record = ?, title = ?, content = ?, visible = ? WHERE uuid = ? AND cardIdx = ?`;
            const values = [image[0].location, record[0].location, title, content, visible, uuid, cardIdx]
            const result = await pool.queryParam_Parse(query, values);
            if(result.affectedRows == 0) throw new NotUpdatedError
    },
    updateAll: async() => {
        //TODO: 카드 배열 및 전체 수정
    },
    delete: async ({cardIdx}, token) => {
        const uuid = jwtExt.verify(token).data.uuid;
        const getQuery = `SELECT * FROM ${TABLE} WHERE cardIdx = ? AND uuid = ?`;
        const getValues = [cardIdx, uuid];
        const getResult = await pool.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new AuthorizationError;
        const deleteQuery = `DELETE FROM ${TABLE} WHERE cardIdx = '${cardIdx}'`;
        const deleteResult = await pool.queryParam_None(deleteQuery);
        if(deleteResult.affectedRows == 0) throw new NotDeletedError;
        return deleteResult;
    }
}

module.exports = card;