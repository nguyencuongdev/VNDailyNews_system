const express = require('express');

const router = express.Router();
const { daboardController } = require('../../controllers/api/v1');
const { getDashboardNewsListValidator } = require('../../middlewares/api');

router.get('/', getDashboardNewsListValidator, daboardController.getDaboardNewsList);

module.exports = router;