const express = require('express');
const router = express.Router();
const { permissionController } = require('../controllers');
const {
    getPermissionsValidator,
    showPermissionCreateValidator,
    createPermissionValidator,
    showEditPermissionValidator,
    editPermissionValidator
} = require('../middlewares');

router.get('/', getPermissionsValidator, permissionController.showPermissionList);
router.get('/create', showPermissionCreateValidator, permissionController.showCreateNewPermission);
router.post('/create', createPermissionValidator, permissionController.handleCreatePermission);
router.get('/:id/edit', showEditPermissionValidator, permissionController.showEditPermission);
router.put('/:id/edit', editPermissionValidator, permissionController.handleEditPermission);

module.exports = router;