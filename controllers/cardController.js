
//카드 정보
const Card = require('../model/card');
const { util, status, message} = require('../modules/utils');
const NAME = '카드'; 

module.exports = {
    signIn: async(req, res) => 
        User.signIn(req.body)
        .then((token) =>
            res.status(status.OK)
            .send(util.successTrue(message.LOGIN_SUCCESS,token)))
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))


const Card = require('../model/card');
const {util, status, message} = require('../modules/utils');
const CARD = '카드';

module.exports = {
    readAll: async (req, res) => {
        Card.readAll()
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_READ_ALL_SUCCESS, result))
        )
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.message))
        )
    },
    read: async (req, res) => {
        const cardIdx = req.params.cardIdx
        Card.read(cardIdx)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_READ_SUCCESS, result))
        )
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.message))
        )
    },
    count: async (req, res) => {
        const cardIdx = req.params.cardIdx
        Card.count(cardIdx)
        .then(result => 
            res.status(status.OK)
            .send(util.successTrue(message.CARD_COUNT_SUCCESS, result))
        )
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message))
        )
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
        Card.delete(req.body, req.headers.token)
        .then(() => 
            res.status(status.OK)
            .send(util.successTrue(message.CARD_DELETE_SUCCESS))
        )
        .catch(err =>  {
            console.log(err);
            res.status(err.status || 500)
            .send(util.successFalse(err.message))
        })
    }

}