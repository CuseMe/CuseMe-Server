const express = require('express');
const router = express.Router({mergeParams: true});
const CardController = require('../controllers/cardController');

router.get('/',CardController.readAll)
router.get('/:cardIdx',CardController.read);
router.put('/:cardIdx/count',CardController.count);
router.post('/',CardController.create);
router.put('/:cardIdx',CardController.update);
router.put('/',CardController.update);
router.delete('/',CardController.delete);

module.exports = router