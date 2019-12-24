const Card = require('../model/card');
const {
    util,
    status,
    message
} = require('../modules/utils');
const CARD = '카드';

module.exports = {
    read: async (req, res) => {
        const cardIdx = req.params.cardIdx
        console.log(cardIdx)
        Card.read(cardIdx)
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_READ_SUCCESS(CARD), result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    },
    readAll: async (req, res) => {
        Card.readAll()
        .then(result =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_READ_SUCCESS(CARD), result)))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    },
    create: async (req, res) => {
        Card.create(req.body)
        .then(() =>
            res.status(status.OK)
            .send(util.successTrue(message.CARD_CREATE_SUCCESS(CARD))))
        .catch(err =>
            res.status(err.status || 500)
            .send(util.successFalse(err.message)))
    }
}