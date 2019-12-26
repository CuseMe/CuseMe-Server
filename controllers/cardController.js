const Card = require('../model/card');
const { util, status, message} = require('../modules/utils');
const NAME = '카드'; 

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
        Card.read(cardIdx)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_READ_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    },
    count: async (req, res) => {
        const cardIdx = req.params.cardIdx
        Card.count(cardIdx)
        .then(result => 
            res.status(status.OK)
            .send(util.successTrue(message.CARD_COUNT_SUCCESS, result)))
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    },
    create: async(req, res) => {
        Card.create(req.files, req.body)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_CREATE_SUCCESS)))
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))}
    ,
    update: async(req, res) => {
        Card.update(req.files, req.body, req.params.cardIdx)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_UPDATE_SUCCESS)))
        .catch(err => 
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))}
    ,
    updateAll: async(req, res) => {
        //TODO: 카드 배열 및 전체 수정
    }
    ,
    delete: async(req, res) => {
        Card.delete(req.body, req.headers.token)
        .then(() => 
            res.status(status.OK)
            .send(util.successTrue(message.CARD_DELETE_SUCCESS)))
        .catch(err =>  {
            console.log(err);
            res.status(err.status || 500)
            .send(util.successFalse(err.message))})}
}