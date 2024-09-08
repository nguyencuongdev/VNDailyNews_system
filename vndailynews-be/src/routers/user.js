const express = require('express');
const Router = express.Router();
const {
    getUsersValidator, createUserValidator, showUserCreateValidator,
    showEditUserValidator, editUserValidator, deleteUserValidator
}
    = require('../middlewares');

const { userController } = require('../controllers');

Router.get('/', getUsersValidator, userController.showUserList);
Router.get('/create', showUserCreateValidator, userController.showUserCreate);
Router.post('/create', createUserValidator, userController.handleCreateUser);
Router.get('/:id/edit', showEditUserValidator, userController.showUserUpdate);
Router.put('/:id/edit', editUserValidator, userController.handleUpdateUser);
Router.delete('/delete', deleteUserValidator, userController.handleDeleteUser)



module.exports = Router;

