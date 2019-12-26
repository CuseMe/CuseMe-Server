const express = require('express');
const router = express.Router({mergeParams: true});
const CardController = require('../controllers/cardController');
const upload = require('../config/multer')

router.get('/',CardController.readAll)
router.get('/:cardIdx',CardController.read);
router.put('/:cardIdx/count',CardController.count);
router.post('/',upload.single('image'), upload.single('record'), CardController.create);
router.put('/:cardIdx',CardController.update);
router.put('/',CardController.update);
router.delete('/',CardController.delete);

module.exports = router