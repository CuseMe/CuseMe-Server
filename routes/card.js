const express = require('express');
const router = express.Router({mergeParams: true});
const CardController = require('../controllers/cardController');
const upload = require('../config/multer')
const {LoggedIn} = require('../modules/utils/authUtil');
const cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'record', maxCount: 1 }])

router.get('/', LoggedIn, CardController.readAll);
router.post('/visible', CardController.readVisible);
router.get('/:cardIdx', LoggedIn, CardController.read);
router.put('/:cardIdx/count', LoggedIn, CardController.count);
router.post('/', LoggedIn, cpUpload, CardController.create);
router.post('/:serialNum', LoggedIn, cpUpload, CardController.download);
router.put('/:cardIdx', LoggedIn, cpUpload, CardController.update);
router.put('/', LoggedIn, CardController.updateAll);
router.delete('/', LoggedIn, CardController.delete);

console.log('baseUri/cards');

module.exports = router;
