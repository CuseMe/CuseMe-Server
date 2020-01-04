const express = require('express');
const router = express.Router({mergeParams: true});
const upload = require('../config/multer')
const {LoggedIn} = require('../modules/utils/authUtil');
const cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'record', maxCount: 1 }])
const Card = require('../controller/card');
const {
    util,
    status,
    message
} = require('../modules/utils');

router.get('/', LoggedIn, (req, res) => 
    Card.readAll(req.headers.token)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.CARD_READ_ALL_SUCCESS, result)))
    .catch(err => {
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message))}));
router.post('/visible', (req, res) => {
    Card.readVisible(req.body.uuid)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.CARD_READ_VISIBLE_SUCCESS, result)))
    .catch(err =>
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message)))});
router.get('/:cardIdx', LoggedIn, (req, res) => {
    const cardIdx = req.params.cardIdx
    Card.count(cardIdx, req.headers.token)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.CARD_COUNT_SUCCESS, result)))
    .catch(err => {
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message))})});
router.put('/:cardIdx/count', LoggedIn, (req, res) => {
    const cardIdx = req.params.cardIdx
    Card.read(cardIdx, req.headers.token)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.CARD_READ_SUCCESS, result)))
    .catch(err =>
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message)))});
router.post('/', LoggedIn, cpUpload, (req, res) => 
    Card.create(req.files, req.body, req.headers.token)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.CARD_CREATE_SUCCESS, result)))
    .catch(err =>
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message))));
router.post('/:serialNum', LoggedIn, cpUpload, (req, res) => {
    const serialNum = req.params.serialNum;
    Card.download(req.headers.token, serialNum)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.CARD_DOWNLOAD_SUCCESS,result)))
    .catch(err =>
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message)))});
router.put('/:cardIdx', LoggedIn, cpUpload, (req, res) => {
    Card.update(req.files, req.body, req.headers.token, req.params.cardIdx)
    .then(result =>
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.CARD_UPDATE_SUCCESS, result)))
    .catch(err =>
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message)))});
router.put('/', LoggedIn, (req, res) => {
    Card.updateAll(req.body.updateArr, req.headers.token)
    .then(() =>
    res.status(status.OK)
        .send(util.successTrue(status.OK,message.CARD_UPDATE_SUCCESS)))
    .catch(err =>  {
        res.status(err.status || 500)
        .send(util.successFalse(err.status,err.message))})});
router.delete('/:cardIdx', LoggedIn, (req, res) => {
    Card.delete(req.params.cardIdx, req.headers.token)
    .then(() => 
        res.status(status.OK)
        .send(util.successTrue(status.OK, message.CARD_DELETE_SUCCESS)))
    .catch(err =>  {
        res.status(err.status || 500)
        .send(util.successFalse(err.status, err.message))})});

module.exports = router;
