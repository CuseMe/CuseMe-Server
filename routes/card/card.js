const express = require('express');
const router = express.Router({mergeParams: true});
const cardControllers = require('../../controllers/cardController');

router.get('/:cardIdx', cardControllers.read);
router.get('/cards', cardControllers.readAll);
router.post('/', cardControllers.create);

module.exports = router;