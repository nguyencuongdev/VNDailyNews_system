const express = require('express');
const router = express.Router();
const { isLogined, authRole, showNewsCreateValidator, createNewsValidator, eidtNewsValidator, deleteNewsValidator, updateStatusNewValidator } = require('../middlewares');
const { newsController } = require('../controllers');

router.get('/', [isLogined, authRole], newsController.showNewsList);
router.get('/:id/detail', [isLogined, authRole], newsController.showInforDetailNews);

router.get('/:id/edit', [isLogined, authRole], newsController.showEditNews);
router.put('/:id', eidtNewsValidator, newsController.handleEditNews);

router.get('/create', showNewsCreateValidator, newsController.showNewsCreate);
router.post('/create', createNewsValidator, newsController.handleCreateNews);

router.delete('/delete', deleteNewsValidator, newsController.handleDeleteNews);
router.put('/update-status/:id', updateStatusNewValidator, newsController.handleUpdateStatusNews);

module.exports = router;