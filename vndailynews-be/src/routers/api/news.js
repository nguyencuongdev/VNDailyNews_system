const express = require('express');
const router = express.Router();
const { newsController } = require('../../controllers/api/v1');
const {
    getNewsNewListValidator, getNewsProposeListValidator,
    getInforDetailNewsValidator, getNewsListBySearchValidator,
    updateAmountSeenNewsValidator
} = require('../../middlewares/api');

router.get('/new', getNewsNewListValidator, newsController.getNewsNewList);
router.get('/propose', getNewsProposeListValidator, newsController.getNewsProposeList);
router.get('/by-search', getNewsListBySearchValidator, newsController.getNewsListBySearch);
router.get('/:id', getInforDetailNewsValidator, newsController.getInforDetailNews);
router.put('/:id', updateAmountSeenNewsValidator, newsController.updateAmountSeenNews);

module.exports = router;