const pool = require('../modules/security/db/pool');
const cardData = require('../modules/data/cardData');
const jwtExt = require('../modules/security/jwt-ext');
const { 
    AuthorizationError, 
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
        const query = `SELECT * from (SELECT cardIdx FROM user JOIN own ON uuid = ? WHERE user.userIdx = own.userIdx) as T join ${TABLE} WHERE T.cardIdx = card.cardIdx AND visible = 1;`;
        const values = [uuid];
        const result = await pool.queryParam_Parse(query,values);
        if(result.length == 0) throw new NotFoundError;
        return result.map(cardData);
    },
    count: async (cardIdx, token) => {
        const userIdx = jwtExt.verify(token).data.userIdx;
        const query = `UPDATE ${TABLE} JOIN own SET count = count + 1 WHERE ${TABLE}.cardIdx = own.cardIdx AND ${TABLE}.cardIdx = ? AND own.userIdx = ?`;
        const values = [cardIdx, userIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.affectedRows == 0) throw new NotFoundError;
    },
    create: async ( //sequence추가해서 저장 
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
            const userIdx = jwtExt.verify(token).data.userIdx;
            const cardCreateQuery = `INSERT INTO ${TABLE}(title, content, image, record, visible, serialNum, sequence) VALUES(?, ?, ?, ?, ?, ?, ?)`;
            const cardCreateValues = [title, content, image[0].location, record[0].location, visible, serialNum, sequence];
            const cardCreateResult = await pool.queryParam_Parse(cardCreateQuery, cardCreateValues);
            if(cardCreateResult.affectedRows == 0) throw new NotCreatedError;
            const cardIdx = cardCreateResult.insertId
            console.log('test '+cardIdx)
            const postQuery = `INSERT INTO own(cardIdx, userIdx) VALUES(?, ?)`;
            const postValues = [cardIdx, userIdx];
            const postResult = await pool.queryParam_Parse(postQuery, postValues);
            console.log(2)
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
            console.log("getResult",getResult[0]);
            const cardIdx = getResult[0].cardIdx;
            const postQuery = `INSERT INTO own(cardIdx, userIdx) VALUES(?, ?)`;
            const postValues = [cardIdx, userIdx];
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
            const userIdx = jwtExt.verify(token).data.userIdx;
            const query = `UPDATE ${TABLE} SET image = ?, record = ?, title = ?, content = ?, visible = ? WHERE userIdx = ? AND cardIdx = ?`;
            const values = [image[0].location, record[0].location, title, content, visible, userIdx, cardIdx]
            const result = await pool.queryParam_Parse(query, values);
            if(result.affectedRows == 0) throw new NotUpdatedError;
    },
    updateAll: async(token, serialNum) => {
        const userIdx = jwtExt.verify(token).data.userIdx; //유저 아이디 검증
        if(!token)throw new NoUserError; //토큰이 없는 경우
        if(!serialNum) throw new ParameterError; //유저의 카드와 서버의 카드에서 다른 부분이 있는 경우

        const query = `SELECT * FROM ${TABLE} JOIN own ON card.cardIdx = own.cardIdx WHERE card.serialNum = ?`;
        const getValues = [serialNum]; //시리얼넘버 배열 받음 
        const getResult = await pool.queryParam_Parse(getQuery, getValues);
        if(getResult.length == 0) throw new NotFoundError;

        const postQuery = `UPDATE `
        
        
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