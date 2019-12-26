const pool = require('../modules/db/pool');
const cardData = require('../modules/data/cardData');
const jwtExt = require('../modules/security/jwt-ext');
const { 
    AuthorizationError, 
    ParameterError,
    NotCreatedError,
    NotDeletedError,
    NotFoundError,
} = require('../errors');
const TABLE = 'card';
const CARD = '카드';

const card = {
    read: async (cardIdx) => {
        const query = `SELECT * FROM ${TABLE} WHERE cardIdx = ${cardIdx}`;
        const values = [cardIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.length == 0) throw new NotFoundError(CARD);
        const card = cardData(result[0]);
        return card;
    },
    readAll: async () => {
        const query = `SELECT * FROM ${TABLE}`;
        const result = await pool.queryParam_None(query);
        if(result.length == 0) throw new NotFoundError(CARD);
        const cardArr = [];
        result.forEach((rawCard, index, result) => 
            cardArr.push(cardData(rawCard)));
        return cardArr;
    },
    count: async (cardIdx) => {
        const query = `UPDATE ${TABLE} SET count = count + 1 WHERE cardIdx = ${cardIdx}`;
        const values = [cardIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.affectedRows == 0) throw new NotFoundError(CARD);
    },
    create: async (
        image,
        record,
        {title,
        content,
        visible,
        userIdx}) => {
            console.log('title',title)
            if(!title || !content || !visible || !userIdx) throw new ParameterError
            const serialNum = Math.random().toString(36).substring(3);
            const query = `INSERT INTO ${TABLE}(title, content, image, record, visible, serialNum, userIdx) VALUES(?, ?, ?, ?, ?, ?, ?)`
            const values = [title, content, image.location, record.location, visible, serialNum, userIdx]
            const result = await pool.queryParam_Parse(query, values);
            if(result.affectedRows == 0) throw new NotCreatedError(CARD)
    }
    ,
    update: {
        //TODO: 카드 상세 수정
    }
    ,
    updateAll: {
        //TODO: 카드 배열 및 전체 수정
    }
    ,
    delete: {
        //TODO: 카드 상세 삭제
    }
}

module.exports = card