const express = require('express');
const Router = express.Router();
const { roleContronller } = require('../controllers');
const {
    getRolesValidator,
    createRoleValidator, showRoleCreateValidator,
    showEditRoleValidator, editRoleValidator
} = require('../middlewares');

Router.get('/', getRolesValidator, roleContronller.showRoleList);
Router.get('/create', showRoleCreateValidator, roleContronller.showCreateNewRole);
Router.post('/create', createRoleValidator, roleContronller.handleCreateNewRole);

Router.get('/:id/edit', showEditRoleValidator, roleContronller.showEditRole);
Router.put('/:id/edit', editRoleValidator, roleContronller.handleEditRole);


module.exports = Router;