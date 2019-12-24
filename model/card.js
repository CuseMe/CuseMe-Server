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
    readAll: {
        //TODO: 카드 전체 조회
    }
    ,
    read: {
        //TODO: 카드 상세 조회
    }
    ,
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