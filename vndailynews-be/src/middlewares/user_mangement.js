const { validationResult } = require('express-validator');
const { Role } = require('../models');
const { isLogined, authRole } = require('./auth');
const {
    createUserSchemaValidate, editUserSchemaValidate, deleteUserSchemaValidate,
    getUsersSchemaValidator,
    paginationSchemaValidate
}
    = require('../libs/express_validator');


const checkPermission = (req, res, next) => {
    if (req.permission !== 1) {
        return res.status(403).render('404.pug');
    }
    next();
}

const getUsersValidator = [isLogined, authRole, checkPermission,
    ...getUsersSchemaValidator,
    async (req, res, next) => {
        const errorsValidator = validationResult(req);
        if (!errorsValidator.isEmpty())
            return res.status(403).redirect('/404')
        next();
    }
]


const showUserCreateValidator = [isLogined, authRole, checkPermission]
const createUserValidator = [isLogined, authRole, checkPermission,
    ...createUserSchemaValidate, async (req, res, next) => {
        try {
            const roles = await Role.findAll({
                order: [
                    ['ten', 'ASC']
                ]
            })
            const errorsValidator = validationResult(req);

            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('users/create.pug', {
                    frontEndURL: process.env.FRONTENDURL,
                    user: req.user,
                    inforUserNew: {
                        username: req.body.username,
                        account: req.body.account,
                        password: req.body.password,
                        comfirmPassword: req.body.comfirmPassword,
                        roleID: +req.body.roleID,
                        email: req.body.email,
                        phone: req.body.phone,
                        status: req.body.status === '1' ? true : false,
                        note: req.body.note
                    },
                    roles,
                    path: '/users/create',
                    status: false,
                    msg: 'Thêm mới người dùng không thành công!',
                    errors: errorsValidator.array(),
                    p: 0,
                    fposc: 0,
                    lposc: 3
                })
            }
            req.roles = roles;
            next();
        } catch (err) {
            return res.status(500).redirect('/500');

        }
    }
]

const showEditUserValidator = [
    isLogined, authRole, checkPermission,
    ...paginationSchemaValidate,
    async (req, res, next) => {
        try {
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).redirect('/404');
            }
            next();
        } catch (err) {
            return res.status(500).redirect('/500');

        }
    }
]
const editUserValidator = [isLogined, authRole, checkPermission,
    ...editUserSchemaValidate, async (req, res, next) => {
        try {
            const roles = await Role.findAll({
                order: [
                    ['ten', 'ASC']
                ]
            })
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('users/edit.pug', {
                    frontEndURL: process.env.FRONTENDURL,
                    user: req.user,
                    inforUser: {
                        id: req.params.id,
                        username: req.body.username,
                        account: req.body.account,
                        password: req.body.password,
                        roleID: +req.body.roleID,
                        email: req.body.email,
                        phone: req.body.phone,
                        status: req.body.status === '1' ? true : false,
                        note: req.body.note
                    },
                    roles,
                    path: '/users/edit',
                    status: false,
                    msg: 'Cập nhật người dùng không thành công!',
                    errors: errorsValidator.array(),
                    p: req.query.p,
                    fposc: req.query.fposc,
                    lposc: req.query.lposc,
                })
            }
            req.roles = roles;
            next();
        } catch (err) {
            return res.status(500).redirect('/500');
        }
    }
]

const deleteUserValidator = [isLogined, authRole, checkPermission,
    ...deleteUserSchemaValidate, async (req, res, next) => {
        const erorrValidates = validationResult(req);
        if (!erorrValidates.isEmpty()) {
            return res.status(403).json({
                message: 'Id thể loại không hợp lệ!',
                statusCode: 403,
                statusText: 'error client'
            })
        }
        next();
    }
]


module.exports = {
    getUsersValidator,
    showUserCreateValidator,
    createUserValidator,
    showEditUserValidator,
    editUserValidator,
    deleteUserValidator
}