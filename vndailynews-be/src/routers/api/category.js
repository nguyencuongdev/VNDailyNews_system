const express = require('express');
const router = express.Router();
const { categoryController } = require('../../controllers/api/v1');
const { getNewsListOfCategoryValidator } = require('../../middlewares/api');

router.get('/', categoryController.getCategoryList);
router.get('/:id', getNewsListOfCategoryValidator, categoryController.getNewsListOfCategory);

module.exports = router;