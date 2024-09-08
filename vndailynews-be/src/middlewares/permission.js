const { validationResult } = require('express-validator');

const { isLogined, authRole } = require('./auth');
const {
    getPermissionsSchemaValidator,
    createPermissionSchemaValidate, editPermissionSchemaValidate,
    paginationSchemaValidate
}
    = require('../libs/express_validator');


const checkPermission = (req, res, next) => {
    if (req.permission !== 1) {
        return res.status(403).render('404.pug');
    }
    next();
}

const getPermissionsValidator = [isLogined, authRole, checkPermission,
    ...getPermissionsSchemaValidator,
    async (req, res, next) => {
        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty())
            return res.status(403).redirect('/404')
        next();
    }
]

const showPermissionCreateValidator = [isLogined, authRole, checkPermission]
const createPermissionValidator = [isLogined, authRole, checkPermission,
    ...createPermissionSchemaValidate, async (req, res, next) => {
        try {
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('permissions/create.pug', {
                    user: req.user,
                    name: req.body.name,
                    note: req.body.note,
                    path: '/permissions/create',
                    status: false,
                    msg: 'Thêm mới quyền không thành công!',
                    errors: errorsValidator.array(),
                    p: 0,
                    fposc: 0,
                    lposc: 3
                })
            }
            next();
        } catch (err) {
            return res.status(500).redirect('/500');

        }
    }
]

const showEditPermissionValidator = [
    isLogined, authRole, checkPermission,
    ...paginationSchemaValidate,
    async (req, res, next) => {
        const errorsValidator = validationResult(req);
        if (!errorsValidator.isEmpty()) {
            return res.status(403).render('permissions/edit.pug', {
                user: req.user,
                path: '/permissions/edit',
                status: false,
                errors: errorsValidator.array(),
                p: req.query.p,
                fposc: req.query.fposc,
                lposc: req.query.lposc,
            })
        }
        next();
    }
]

const editPermissionValidator = [isLogined, authRole, checkPermission,
    ...editPermissionSchemaValidate, async (req, res, next) => {
        try {
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('permissions/edit.pug', {
                    user: req.user,
                    path: '/permissions/edit',
                    status: false,
                    msg: 'Chỉnh sửa quyền không thành công!',
                    id: +req.params.id,
                    name: req.body.name,
                    note: req.body.note,
                    errors: errorsValidator.array(),
                    p: req.query.p,
                    fposc: req.query.fposc,
                    lposc: req.query.lposc,
                })
            }
            next();
        } catch (err) {
            return res.status(500).redirect('/500');
        }
    }
]



module.exports = {
    getPermissionsValidator,
    showPermissionCreateValidator,
    createPermissionValidator,
    showEditPermissionValidator,
    editPermissionValidator
}