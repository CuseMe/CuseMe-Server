const Card = require('../model/card');
const {
    util,
    status,
    message
} = require('../modules/utils');

module.exports = {
    readAll: async (req, res) => {
        Card.readAll(req.headers.token)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_READ_ALL_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message))})
    },
    read: async (req, res) => {
        const cardIdx = req.params.cardIdx
        Card.read(cardIdx, req.headers.token)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_READ_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message)
            ))
    },
    readVisible: async (req, res) => {
        Card.readVisible(req.body.uuid)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_READ_VISIBLE_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message)
            ))
    },
    count: async (req, res) => {
        const cardIdx = req.params.cardIdx
        Card.count(cardIdx, req.body.uuid)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_COUNT_SUCCESS, result)))
        .catch(err => {
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message))})
    },
    create: async(req, res) => {
        Card.create(req.files, req.body, req.headers.token)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_CREATE_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message)))
    },
    download: async(req, res) => {
        const serialNum = req.params.serialNum;
        Card.download(req.headers.token, serialNum)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_DOWNLOAD_SUCCESS,result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message)))
    },
    update: async (req, res) => {
        Card.update(req.files, req.body, req.headers.token, req.params.cardIdx)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_UPDATE_SUCCESS, result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message)))
    },
    updateAll: async(req, res) => {
        Card.updateAll(req.body, req.headers.token)
        .then(() =>
        res.status(status.OK)
            .send(util.successTrue(status.OK,message.CARD_UPDATE_SUCCESS)))
        .catch(err =>  {
            res.status(err.status || 500)
            .send(util.successFalse(err.status,err.message))})
    },
    delete: async (req, res) => {
        Card.delete(req.params.cardIdx, req.headers.token)
        .then(() => 
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_DELETE_SUCCESS)))
        .catch(err =>  {
            res.status(err.status || 500)
            .send(util.successFalse(err.status, err.message))})
    },
    hide: async(req, res) => {
        Card.hide(req.params.cardIdx, req.headers.token, req.body)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(status.OK, message.CARD_HIDE_SUCCESS)))
        .catch(err =>  {
            res.status(err.status || 500)
            .send(util.successFalse(err.status,err.message))})
    }

}
