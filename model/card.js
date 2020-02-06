const pool = require('../modules/security/db/pool');
const cardData = require('../modules/data/cardData');
const jwtExt = require('../modules/security/jwt-ext');
const { 
    ParameterError,
    NotCreatedError,
    NotDeletedError,
    NotFoundError,
    NotUpdatedError,
    DuplicatedEntryError,
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
        return result.map(cardData);
    },
    readVisible: async (uuid) => {
        const query = `SELECT * FROM ${CARD_TABLE} JOIN (SELECT cardIdx, visible, count, sequence FROM ${USER_TABLE} JOIN ${OWN_TABLE} ON ${USER_TABLE}.userIdx = ${OWN_TABLE}.userIdx WHERE uuid = ? AND ${OWN_TABLE}.visible = 1) AS T WHERE T.cardIdx = ${CARD_TABLE}.cardIdx`;
        const values = [uuid];
        const result = await pool.queryParam_Parse(query, values);
        return result.map(cardData);
    },
    count: async (cardIdx, token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        const query = `UPDATE ${CARD_TABLE} JOIN ${OWN_TABLE} SET count = count + 1 WHERE ${CARD_TABLE}.cardIdx = ${OWN_TABLE}.cardIdx AND ${CARD_TABLE}.cardIdx = ? AND ${OWN_TABLE}.userIdx = ?`;
        const values = [cardIdx, userIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.affectedRows == 0) throw new NotFoundError;
    },
    create: async (
        {image,
        record},
        {title,
        content,
        visible},
        token) => {
            if(!image || !title || !content) throw new ParameterError
            let serialNum = Math.random().toString(36).substring(3);
            const verifyQuery = `SELECT serialNum FROM ${CARD_TABLE} WHERE serialNum = ?`;
            let verifyValues = [serialNum];
            let verifyResult = await pool.queryParam_Parse(verifyQuery, verifyValues);
            while(verifyResult.length != 0 ){
                let serialNum = Math.random().toString(36).substring(3);
                let verifyValues = [serialNum];
                verifyResult = await pool.queryParam_Parse(verifyQuery, verifyValues);
            }
            const userIdx = jwtExt.verify(token).data.userIdx;
            let cardCreateResult = null;
            if(!record){
                const cardCreateQuery = `INSERT INTO ${CARD_TABLE}(title, content, image, serialNum) VALUES(?, ?, ?, ?)`;
                const cardCreateValues = [title, content, image[0].location, serialNum];
                cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
                if(cardCreateResult.affectedRows == 0) throw new NotCreatedError;
            }else{
                const cardCreateQuery = `INSERT INTO ${CARD_TABLE}(title, content, image, record, serialNum) VALUES(?, ?, ?, ?, ?)`;
                const cardCreateValues = [title, content, image[0].location, record[0].location, serialNum];
                cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
                if(cardCreateResult.affectedRows == 0) throw new NotCreatedError;
            }
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
            const query = `SELECT * FROM card WHERE cardIdx = ?`;
            const value = [cardIdx];
            const result = await pool.queryParam_Parse(query, value);
            return result[0];
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
            const insertQuery = `INSERT INTO ${CARD_TABLE}(title, content, image, record, serialNum) VALUES(?, ?, ?, ?, ?)`
            let serialNum1 = Math.random().toString(36).substring(3);
            const insertValue = [getResult[0].title, getResult[0].content, getResult[0].image, getResult[0].record, serialNum1]
            const insertResult = await pool.queryParam_Parse(insertQuery, insertValue);
            if(insertResult.affectedRows == 0) throw new NotCreatedError;
            const getSequenceQuery = `SELECT count(sequence) as count FROM ${OWN_TABLE} JOIN ${CARD_TABLE} WHERE ${OWN_TABLE}.cardIdx = ${CARD_TABLE}.cardIdx AND userIdx = ?`;
            const getSequenceValues = [userIdx];
            const getSequenceResult = await pool.queryParam_Parse(getSequenceQuery, getSequenceValues);
            if(getSequenceResult.length == 0) throw new NotFoundError;
            const sequence = getSequenceResult[0].count;
            const countQuery = `SELECT COUNT(cardIdx) as count FROM ${CARD_TABLE}`
            const countResult = await pool.queryParam_None(countQuery);
            const cardIdx = countResult[0].count-1
            const postQuery = `INSERT INTO ${OWN_TABLE}(cardIdx, userIdx, sequence) VALUES(?, ?, ?)`;
            const postValues = [cardIdx, userIdx, sequence];
            const postResult = await pool.queryParam_Parse(postQuery, postValues);
            if(postResult.affectedRows == 0) throw new NotCreatedError;
            const query = `SELECT * FROM ${CARD_TABLE} JOIN ${OWN_TABLE} ON ${CARD_TABLE}.cardIdx = ${OWN_TABLE}.cardIdx WHERE ${CARD_TABLE}.serialNum = ?`;
            const values = [serialNum1]
            const result = await pool.queryParam_Parse(query, values)
            const card = cardData(result[0]);
            return card
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
            if(!record){
                const cardCreateQuery = `INSERT INTO ${CARD_TABLE}(title, content, image, serialNum) VALUES(?, ?, ?, ?)`;
                const cardCreateValues = [title, content, image[0].location, serialNum];
                cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
                if(cardCreateResult.affectedRows == 0) throw new NotCreatedError;
            }else{
                const cardCreateQuery = `INSERT INTO ${CARD_TABLE}(title, content, image, record, serialNum) VALUES(?, ?, ?, ?, ?)`;
                const cardCreateValues = [title, content, image[0].location, record[0].location, serialNum];
                cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
                if(cardCreateResult.affectedRows == 0) throw new NotCreatedError;
            }
            // const cardCreateQuery = `INSERT INTO ${CARD_TABLE}(title, content, image, record, serialNum) VALUES(?, ?, ?, ?, ?)`; 
            // const cardCreateValues = [title, content, image[0].location, record[0].location, serialNum];
            // const cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
            // if(cardCreateResult.affectedRows == 0) throw new NotUpdatedError;
            
            const newIdx = cardCreateResult.insertId;
            const query = `UPDATE ${OWN_TABLE} SET cardIdx = ? WHERE userIdx = ? and cardIdx = ?`; 
            const values = [newIdx,userIdx,cardIdx]
            const result = await pool.queryParam_Parse(query, values);
            if(result.affectedRows == 0) throw new NotUpdatedError;
            const resultQuery = `SELECT * FROM card WHERE cardIdx = ?`;
            const resultValue = [newIdx];
            const resultResult = await pool.queryParam_Parse(resultQuery, resultValue);
            return resultResult[0];
        
    },
    updateAll: async(
        arr,
        token) => {
        if(!arr) throw new ParameterError;
        const userIdx = jwtExt.verify(token).data.userIdx;
        for (var i=0; i<arr.updateArr.length; i++){
            console.log("arr" + arr[0])
            const putQuery = `UPDATE ${OWN_TABLE} SET sequence = ?, visible = ? WHERE cardIdx = ? and userIdx = ?`;
            const visible = arr.updateArr[i].visible
            const visible_boolean = ~~Boolean(visible)
            const putValues = [arr.updateArr[i].sequence, visible_boolean, arr.updateArr[i].cardIdx , userIdx];
            const putResult = await pool.queryParam_Parse(putQuery, putValues);
            if(putResult.affectedRows == 0) throw new NotUpdatedError;
        }
        const getQuery = `SELECT * FROM own WHERE userIdx = ?`;
        const getValues = [userIdx];
        const getResult = await pool.queryParam_Parse(getQuery, getValues);
        console.log(getResult)
        return getResult
    },
    delete: async(cardIdx, token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        const getQuery = `SELECT * FROM ${OWN_TABLE} WHERE cardIdx = ? AND userIdx = ?`;
        const getValues = [cardIdx, userIdx];
        const getResult = await pool.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new NotFoundError;
        const deleteQuery = `DELETE FROM ${OWN_TABLE} WHERE cardIdx = '${cardIdx}' AND userIdx = ${userIdx}`;
        const deleteResult = await pool.queryParam_None(deleteQuery);
        if(deleteResult.affectedRows == 0) throw new NotDeletedError;
        return deleteResult;
    },
    hide: async(cardIdx, token) => {
        if(!cardIdx) throw new ParameterError;
        const userIdx = jwtExt.verify(token).data.userIdx;
        const query = `UPDATE ${OWN_TABLE} SET visible = 0 WHERE userIdx = ? and cardIdx = ?`;
        const values = [userIdx, cardIdx];
        const putResult = await pool.queryParam_Parse(query, values);
        if(putResult.affectedRows == 0) throw new NotUpdatedError;
        return putResult
    }
}

module.exports = card;