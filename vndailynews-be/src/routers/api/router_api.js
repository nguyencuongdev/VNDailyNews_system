const express = require('express');
const router = express.Router();

router.use('/dashboard-news', require('./daboard'));
router.use('/categorys', require('./category'));
router.use('/news', require('./news'));
router.use('/tags', require('./tag'));

module.exports = router;