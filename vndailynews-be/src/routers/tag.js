const express = require('express');
const Router = express.Router();
const {
    createTagValidator, showEditTagValidator, editTagValidator,
    getTagsValidator, showTagCreateValidator,
    deleteTagValidator
} = require('../middlewares');
const { tagController } = require('../controllers');

Router.get('/', getTagsValidator, tagController.showTagList);
Router.get('/:id/edit', showEditTagValidator, tagController.showEditTag);
Router.put('/:id/edit', editTagValidator, tagController.handleEditTag);
Router.get('/create', showTagCreateValidator, tagController.showTagCreate);
Router.post('/create', createTagValidator, tagController.handleCreateTag);
Router.delete('/delete', deleteTagValidator, tagController.handleDeleteTag);

module.exports = Router;

