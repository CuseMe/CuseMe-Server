const express = require('express');
const router = express.Router({mergeParams: true});
const CardController = require('../controllers/cardController');
const upload = require('../config/multer')

var cpUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'record', maxCount: 1 }])
router.get('/',CardController.readAll)
router.get('/:cardIdx',CardController.read);
router.put('/:cardIdx/count',CardController.count);
router.post('/',cpUpload, CardController.create);
router.put('/:cardIdx',cpUpload, CardController.update);
router.put('/',CardController.update);
router.delete('/',CardController.delete);

console.log('baseUri/cards');

module.exports = router