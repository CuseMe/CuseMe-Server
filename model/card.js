const pool = require('../modules/security/db/pool');
const cardData = require('../modules/data/cardData');
const jwtExt = require('../modules/security/jwt-ext');
const { 
    ParameterError,
    NotCreatedError,
    NotDeletedError,
    NotFoundError,
    NotUpdatedError,
    NoReferencedRowError
} = require('../errors');
const CARD_TABLE = 'card';
const OWN_TABLE = 'own';
const USER_TABLE = 'user';

const card = {
    read: async (
        cardIdx,
        token) => {
            const userIdx = jwtExt.verify(token).data.userIdx;
            const query = `SELECT * FROM ${CARD_TABLE} JOIN ${OWN_TABLE} ON ${CARD_TABLE}.cardIdx = ${OWN_TABLE}.cardIdx WHERE ${CARD_TABLE}.cardIdx = ? AND ${OWN_TABLE}.userIdx = ?`;
            const values = [cardIdx, userIdx]
            const result = await pool.queryParam_Parse(query, values);
            if(result.length == 0) throw new NotFoundError;
            const card = cardData(result[0]);
            return card;
    },
    readAll: async (token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        const query = `SELECT * FROM ${CARD_TABLE} JOIN ${OWN_TABLE} ON ${CARD_TABLE}.cardIdx = ${OWN_TABLE}.cardIdx WHERE ${OWN_TABLE}.userIdx = ?`;
        const values = [userIdx]
        const result = await pool.queryParam_Parse(query,values);
        if(result.length == 0) return [];//throw new Error 는??
        return result.map(cardData);
    },
    readVisible: async (uuid) => {
        //const userIdx = jwtExt.verify(token).data.userIdx;
        //const query = `SELECT * FROM ${CARD_TABLE} JOIN ${OWN_TABLE} ON ${CARD_TABLE}.cardIdx = ${OWN_TABLE}.cardIdx where ${OWN_TABLE}.visible = 1 AND ${OWN_TABLE}.userIdx = ?`;        
        const query = `SELECT * FROM ${CARD_TABLE} JOIN (SELECT cardIdx FROM ${USER_TABLE} JOIN ${OWN_TABLE} ON ${USER_TABLE}.userIdx = ${OWN_TABLE}.userIdx WHERE uuid = ? AND ${OWN_TABLE}.visible = 1) AS T WHERE T.cardIdx = ${CARD_TABLE}.cardIdx`;
        const values = [uuid];
        const result = await pool.queryParam_Parse(query, values);
        if(result.length == 0) [];
        return result.map(cardData);
    },
    count: async (cardIdx, token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        const query = `UPDATE ${CARD_TABLE} JOIN ${OWN_TABLE} SET count = count + 1 WHERE ${CARD_TABLE}.cardIdx = ${OWN_TABLE}.cardIdx AND ${CARD_TABLE}.cardIdx = ? AND ${OWN_TABLE}.userIdx = ?`;
        const values = [cardIdx, userIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.affectedRows == 0) throw new NotFoundError;
    },
    create: async ( //sequence추가해서 저장 
        {image,
        record},
        {title,
        content,
        visible},
        token) => {
            if(!image || !title || !content) throw new ParameterError
            //랜덤 시리얼 번호가 같을 때 재설정이 필요
            const serialNum = Math.random().toString(36).substring(3);
            const userIdx = jwtExt.verify(token).data.userIdx;
            const cardCreateQuery = `INSERT INTO ${CARD_TABLE}(title, content, image, record, serialNum) VALUES(?, ?, ?, ?, ?)`;
            const cardCreateValues = [title, content, image[0].location, record[0].location, serialNum];
            const cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
            if(cardCreateResult.affectedRows == 0) throw new NotCreatedError;
            const cardIdx = cardCreateResult.insertId;
            const sequenceQuery = `SELECT count(*) AS count FROM ${OWN_TABLE} WHERE userIdx = ?`;
            const sequenceValues = [userIdx];
            const sequenceResult = await pool.queryParam_Parse(sequenceQuery, sequenceValues);
            const count = sequenceResult[0].count;
            const postQuery = `INSERT INTO ${OWN_TABLE}(cardIdx, userIdx, sequence, visible) VALUES(?, ?, ?, ?)`;
            const visible_boolean = ~~Boolean(visible)
            const postValues = [cardIdx, userIdx, count, visible_boolean];
            const postResult = await pool.queryParam_Parse(postQuery, postValues);
            if(postResult.affectedRows == 0) throw new NotCreatedError; 
    },
    download: async (
        token,
        serialNum) => {
            if(!serialNum) throw new ParameterError;
            const userIdx = jwtExt.verify(token).data.userIdx;
            const getQuery = `SELECT * from ${CARD_TABLE} WHERE serialNum = ?`;
            const getValues = [serialNum];
            const getResult = await pool.queryParam_Parse(getQuery, getValues);
            if(getResult.length == 0) throw new NotFoundError;

            const cardIdx = getResult[0].cardIdx;
            const getSequenceQuery = `SELECT sequence FROM ${OWN_TABLE} JOIN ${CARD_TABLE} WHERE ${OWN_TABLE}.cardIdx = ${CARD_TABLE}.cardIdx AND ${CARD_TABLE}.cardIdx = ?`;
            const getSequenceValues = [cardIdx];
            const getSequenceResult = await pool.queryParam_Parse(getSequenceQuery, getSequenceValues);
            if(getSequenceResult.length == 0) throw new NotFoundError;

            const sequence = getSequenceResult[0];
            const postQuery = `INSERT INTO ${OWN_TABLE}(cardIdx, userIdx, sequence) VALUES(?, ?, ?)`;
            const postValues = [cardIdx, userIdx, sequence];
            const postResult = await pool.queryParam_Parse(postQuery, postValues);
            if(postResult.affectedRows == 0) throw new NotCreatedError;

            const query = `select * from card join own`
            return postResult
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
            const serialNum = Math.random().toString(36).substring(3);
            const cardCreateQuery = `INSERT INTO ${CARD_TABLE}(title, content, image, record, serialNum) VALUES(?, ?, ?, ?, ?)`; 
            const cardCreateValues = [title, content, image[0].location, record[0].location, serialNum];
            const cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
            if(cardCreateResult.affectedRows == 0) throw new NotUpdatedError;
            const newIdx = cardCreateResult.insertId;

            const query = `UPDATE ${OWN_TABLE} SET cardIdx = ? WHERE userIdx = ? and cardIdx = ?`; 
            const values = [newIdx,userIdx,cardIdx]
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
        const putQuery = `UPDATE ${OWN_TABLE} SET sequence = ?, visible = ? WHERE cardIdx = ? and userIdx = ?`;
        const putValues = [sequence, visible, cardIdx , userIdx];
        const putResult = await pool.queryParam_Parse(putQuery, putValues);
        if(putResult.affectedRows == 0) throw new NoReferencedRowError;
        return putResult;
    },
    delete: async (cardIdx, token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        const getQuery = `SELECT * FROM ${OWN_TABLE} WHERE cardIdx = ? AND userIdx = ?`;
        const getValues = [cardIdx, userIdx];
        const getResult = await pool.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new NotFoundError;
        const deleteQuery = `DELETE FROM ${OWN_TABLE} WHERE cardIdx = '${cardIdx}' AND userIdx = ${userIdx}`;
        const deleteResult = await pool.queryParam_None(deleteQuery);
        if(deleteResult.affectedRows == 0) throw new NotDeletedError;
        return deleteResult;
    }
}

module.exports = card;