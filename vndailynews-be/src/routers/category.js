const express = require('express');
const Router = express.Router();
const {
    getCategorysValidator, createCategoryValidator, showCategoryCreateValidator,
    showEditCategoryValidator, editCategoryValidator, deleteCategoryValidator
} = require('../middlewares');
const { categoryController } = require('../controllers');

Router.get('/', getCategorysValidator, categoryController.showCategoryList);
Router.get('/create', showCategoryCreateValidator, categoryController.showCreateCategory);
Router.post('/create', createCategoryValidator, categoryController.handleCreateCategory);
Router.get('/:id/edit', showEditCategoryValidator, categoryController.showEditCategory);
Router.put('/:id/edit', editCategoryValidator, categoryController.handleEditCategory);
Router.delete('/delete', deleteCategoryValidator, categoryController.handleDeleteCategory);

module.exports = Router;