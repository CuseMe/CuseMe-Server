const Card = require('../model/card');
const {util, status, message} = require('../modules/utils');
const CARD = '카드';

module.exports = {
    readAll: async (req, res) => {
        Card.readAll()
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_READ_ALL_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    },
    read: async (req, res) => {
        const cardIdx = req.params.cardIdx
        console.log(cardIdx)
        Card.read(cardIdx)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_READ_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    },
    count: async(req, res) => {
        //TODO: 카드 실행 횟수 올리기
    },
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