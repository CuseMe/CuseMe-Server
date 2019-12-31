const Card = require('../model/card');
const {
    util,
    status,
    message
} = require('../modules/utils');
const CARD = '카드';

module.exports = {
    readAll: async (req, res) => {
        Card.readAll(req.headers.token)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_READ_ALL_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST, err.message))})
    },
    read: async (req, res) => {
        const cardIdx = req.params.cardIdx
        Card.read(cardIdx, req.headers.token)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_READ_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST, err.message)
            ))
    },
    readVisible: async (req, res) => {
        console.log("visible")
        Card.readVisible(req.body.uuid)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_READ_VISIBLE_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST, err.message)
            ))
    },
    count: async (req, res) => {
        const cardIdx = req.params.cardIdx
        Card.count(cardIdx, req.headers.token)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_COUNT_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST, err.message))})
    },
    create: async(req, res) => {
        Card.create(req.files, req.body, req.headers.token)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_CREATE_SUCCESS)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST, err.message)))
    },
    download: async(req, res) => {
        const serialNum = req.params.serialNum;
        Card.download(req.headers.token, serialNum)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_DOWNLOAD_SUCCESS)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST, err.message)))
    },
    update: async (req, res) => {
        Card.update(req.files, req.body, req.headers.token, req.params.cardIdx)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_UPDATE_SUCCESS)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST, err.message)))
    },
    updateAll: async(req, res) => {
        Card.updateAll(req.body, req.headers.token)
        .then(() =>
        res.status(status.OK)
            .send(util.successTrue(status.OK,message.CARD_UPDATE_SUCCESS)))
        .catch(err =>  {
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST,err.message))})
    },
    delete: async (req, res) => {
        Card.delete(req.body.cardIdx, req.headers.token)
        .then(() => 
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_DELETE_SUCCESS)))
        .catch(err =>  {
            res.status(err.status || 500)
            .send(util.successFalse(status.BAD_REQUEST, err.message))})}
}
