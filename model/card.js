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
        const query = `SELECT * FROM ${table} WHERE cardIdx = ${cardIdx}`;
        const values = [cardIdx];
        const result = await pool.queryParam_Parse(query, values);
        if(result.length == 0) throw new NotFoundError(CARD);
        const card = cardData(result[0]);
        return card;
    },
    readAll: async () => {
        const query = `SELECT * FROM ${table}`;
        const result = await pool.queryParam_None(query);
        if(result.length == 0) throw new NotFoundError(CARD);
        const cardArr = [];
        result.forEach((rawCard, index, cardError) => 
            cardArr.push(cardData(rawCard)));
        return cardArr;
    },
    count: {
        //TODO: 카드 상세 조회
    }
    ,
    create: async(
        title,
        content,
        record,
        visible
    ) => {
        //TODO: 카드 생성
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