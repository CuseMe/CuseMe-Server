const Card = require('../model/card');
const {util, status, message} = require('../modules/utils');
const NAME = '카드';

module.exports = {
    readAll: {
        //TODO: 카드 전체 조회
    }
    ,
    read: async(req, res) => {
        //TODO: 카드 상세 조회
    }
    ,
    count: async(req, res) => {
        //TODO: 카드 실행 횟수 올리기
    }
    ,
    create: async(req, res) => {
        //TODO: 카드 생성
    }
    ,
    update: async(req, res) => {
        //TODO: 카드 상세 수정
    }
    ,
    updateAll: async(req, res) => {
        //TODO: 카드 배열 및 전체 수정
    }
    ,
    delete: async(req, res) => {
        //TODO: 카드 상세 삭제
    }
}