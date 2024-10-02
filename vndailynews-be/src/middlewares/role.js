const { validationResult } = require('express-validator');
const { Permission } = require('../models');
const { isLogined, authRole } = require('./auth');
const {
    getRolesSchemaValidator, createRoleSchemaValidate, paginationSchemaValidate, editRoleSchemaValidate
}
    = require('../libs/express_validator');


const checkPermission = (req, res, next) => {

    if (req.permission !== 1) {
        return res.status(403).render('404.pug');
    }
    next();
}

const getRolesValidator = [isLogined, authRole, checkPermission,
    ...getRolesSchemaValidator,
    async (req, res, next) => {
        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty())
            return res.status(403).redirect('/404')
        next();
    }
]


const showRoleCreateValidator = [isLogined, authRole, checkPermission]
const createRoleValidator = [isLogined, authRole, checkPermission,
    ...createRoleSchemaValidate, async (req, res, next) => {
        try {
            const permissionList = await Permission.findAll();
            const errorsValidate = validationResult(req);

            if (!errorsValidate.isEmpty()) {
                return res.status(403).render('roles/create.pug', {
                    frontEndURL: process.env.FRONTENDURL,
                    user: req.user,
                    name: req.body.name,
                    permissionID: req.body.permissionID,
                    note: req.body.note,
                    permissions: permissionList,
                    path: '/roles/create',
                    status: false,
                    msg: 'Thêm mới vai trò không thành công!',
                    errors: errorsValidate.array(),
                    p: 0,
                    fposc: 0,
                    lposc: 3
                })
            }
            req.permissionList = permissionList
            next();
        } catch (err) {
            return res.status(500).redirect('/500');

        }
    }
]

const showEditRoleValidator = [
    isLogined, authRole, checkPermission,
    ...paginationSchemaValidate,
    async (req, res, next) => {
        try {
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).redirect('/404');
            }

            const permissionList = await Permission.findAll();
            req.permissionList = permissionList;
            next();
        } catch (err) {
            return res.status(500).redirect('/500');
        }
    }
]

const editRoleValidator = [isLogined, authRole, checkPermission,
    ...editRoleSchemaValidate, async (req, res, next) => {
        try {
            const permissionList = await Permission.findAll();
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('roles/edit.pug', {
                    frontEndURL: process.env.FRONTENDURL,
                    user: req.user,
                    path: '/roles',
                    status: false,
                    id: +req.params.id,
                    name: req.body.name,
                    permissionID: +req.body.permisionID,
                    note: req.body.note,
                    permissions: permissionList,
                    msg: 'Chỉnh sửa vai trò không thành công!',
                    errors: errorsValidator.array(),
                    p: req.query.p,
                    fposc: req.query.fposc,
                    lposc: req.query.lposc,
                })
            }
            req.permissionList = permissionList;
            next();
        } catch (err) {
            return res.status(500).redirect('/500');
        }
    }
]


module.exports = {
    getRolesValidator,
    showRoleCreateValidator,
    createRoleValidator,
    showEditRoleValidator,
    editRoleValidator,
    editRoleValidator
}