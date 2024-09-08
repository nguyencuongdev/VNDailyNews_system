const express = require('express');
const router = express.Router();
const { tagController } = require('../../controllers/api/v1');
const { getNewsOfTagInCategoryValidator } = require('../../middlewares/api');

router.get('/:idTag', getNewsOfTagInCategoryValidator, tagController.getNewsOfTagInCategory);

module.exports = router;