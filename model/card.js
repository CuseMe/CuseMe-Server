const pool = require('../modules/security/db/pool');
const cardData = require('../modules/data/cardData');
const jwtExt = require('../modules/security/jwt-ext');
const { 
    ParameterError,
    NotCreatedError,
    NotDeletedError,
    NotFoundError,
    NotUpdatedError,
    NoUserError
} = require('../errors');
const TABLE = 'card';

const card = {
    read: async (
        cardIdx,
        token) => {
            const userIdx = jwtExt.verify(token).data.userIdx;
            const query = `SELECT * FROM ${TABLE} JOIN own ON card.cardIdx = own.cardIdx WHERE card.cardIdx = ? AND own.userIdx = ?`;
            const values = [cardIdx, userIdx]
            const result = await pool.queryParam_Parse(query, values);
            if(result.length == 0) throw new NotFoundError;
            const card = cardData(result[0]);
            return card;
    },
    readAll: async (token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        const query = `SELECT * FROM ${TABLE} JOIN own ON card.cardIdx = own.cardIdx WHERE own.userIdx = ?`;
        const values = [userIdx]
        const result = await pool.queryParam_Parse(query,values);
        console.log(result);
        if(result.length == 0) throw new NotFoundError;
        return result.map(cardData);
    },
    readVisible: async (uuid) => {
        console.log("uuid ", uuid);
        const query = `SELECT * from (SELECT cardIdx FROM user JOIN own ON uuid = ? WHERE user.userIdx = own.userIdx) as T join ${TABLE} WHERE T.cardIdx = card.cardIdx`;
        const values = [uuid];
        const result = await pool.queryParam_Parse(query,values);
        if(result.length == 0) throw new NotFoundError;
        return result.map(cardData);
    },
    count: async (cardIdx, token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        const query = `UPDATE card JOIN own SET count = count + 1 WHERE card.cardIdx = own.cardIdx AND card.cardIdx = ? AND own.userIdx = ?`;
        const values = [cardIdx, userIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.affectedRows == 0) throw new NotFoundError;
    },
    create: async ( //sequence추가해서 저장 
        {image,
        record},
        {title,
        content},
        token) => {
            if(!image || !title || !content) throw new ParameterError
            //랜덤 시리얼 번호가 같을 때 재설정이 필요
            const serialNum = Math.random().toString(36).substring(3);
            const userIdx = jwtExt.verify(token).data.userIdx;
            const cardCreateQuery = `INSERT INTO ${TABLE}(title, content, image, record, serialNum) VALUES(?, ?, ?, ?, ?)`;
            const cardCreateValues = [title, content, image[0].location, record[0].location, serialNum];
            const cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
            if(cardCreateResult.affectedRows == 0) throw new NotCreatedError;
            const cardIdx = cardCreateResult.insertId;
            const sequenceQuery = `SELECT count(*) AS count FROM own WHERE userIdx = ?`;
            const sequenceValues = [userIdx];
            const sequenceResult = await pool.queryParam_Parse(sequenceQuery, sequenceValues);
            const count = sequenceResult[0].count;
            const postQuery = `INSERT INTO own(cardIdx, userIdx, sequence) VALUES(?, ?, ?)`;
            const postValues = [cardIdx, userIdx, count];
            const postResult = await pool.queryParam_Parse(postQuery, postValues);
            if(postResult.affectedRows == 0) throw new NotCreatedError; 
    },
    download: async (
        token,
        serialNum) => {
            if(!serialNum) throw new ParameterError;
            const userIdx = jwtExt.verify(token).data.userIdx;
            const getQuery = `SELECT * from ${TABLE} WHERE serialNum = ?`;
            const getValues = [serialNum];
            const getResult = await pool.queryParam_Parse(getQuery, getValues);
            if(getResult.length == 0) throw new NotFoundError;
            const cardIdx = getResult[0].cardIdx;
            const getSequenceQuery = `SELECT sequence FROM own JOIN card WHERE own.cardIdx = card.cardIdx AND card.cardIdx = ?`;
            const getSequenceValues = [cardIdx];
            const getSequenceResult = await pool.queryParam_Parse(getSequenceQuery, getSequenceValues);
            if(getSequenceResult.length == 0) throw new NotFoundError;
            const sequence = getSequenceResult[0];
            const postQuery = `INSERT INTO own(cardIdx, userIdx, sequence) VALUES(?, ?, ?)`;
            const postValues = [cardIdx, userIdx, sequence];
            const postResult = await pool.queryParam_Parse(postQuery, postValues);
            if(postResult.affectedRows == 0) throw new NotCreatedError;
    },
    update: async (
        {image,
        record},
        {title,
        content},
        token,
        cardIdx) => {
            if(!image || !title || !content) throw new ParameterError
            const userIdx = jwtExt.verify(token).data.userIdx;
            const query = `UPDATE ${TABLE} SET image = ?, record = ?, title = ?, content = ? WHERE userIdx = ? AND cardIdx = ?`;
            const values = [image[0].location, record[0].location, title, content, userIdx, cardIdx]
            const result = await pool.queryParam_Parse(query, values);
            if(result.affectedRows == 0) throw new NotUpdatedError;
    },
    updateAll: async(
        {cardIdx,
        visible,
        sequence},
        token) => {
        if(!cardIdx ||!visible || !sequence) throw new ParameterError;
        const userIdx = jwtExt.verify(token).data.userIdx;
        const putQuery = `UPDATE own SET sequence = ?, visible = ? WHERE cardIdx = ? and userIdx = ?`;
        const putValues = [sequence, visible, cardIdx , userIdx];
        const putResult = await pool.queryParam_Parse(putQuery, putValues);
        if(deleteResult.affectedRows == 0) throw new Nodata;
        console.log('putResult',putResult)
        if(putResult.length == 0) throw new NotUpdatedError;
        console.log(putResult)
        return putResult;
    },
    delete: async (cardIdx, token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        console.log(cardIdx)
        const getQuery = `SELECT * FROM own WHERE cardIdx = ? AND userIdx = ?`;
        const getValues = [cardIdx, userIdx];
        const getResult = await pool.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new NotFoundError;
        const deleteQuery = `DELETE FROM own WHERE cardIdx = '${cardIdx}' AND userIdx = ${userIdx}`;
        const deleteResult = await pool.queryParam_None(deleteQuery);
        if(deleteResult.affectedRows == 0) throw new NotDeletedError;
        return deleteResult;
    }
}

module.exports = card;