const { validationResult } = require('express-validator');

const { isLogined, authRole } = require('./auth');
const {
    getCategorysSchemaValidator,
    createCategorySchemaValidate,
    editCategorySchemaValidate,
    deleteCategorySchemaValidate,
    paginationSchemaValidate
}
    = require('../libs/express_validator');


const checkPermission = (req, res, next) => {
    if (![1, 3].includes(req.permission)) {
        return res.status(403).render('404.pug');
    }
    next();
}

const getCategorysValidator = [isLogined, authRole, checkPermission,
    ...getCategorysSchemaValidator,
    async (req, res, next) => {
        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty())
            return res.status(403).redirect('/404')
        next();
    }
]


const showCategoryCreateValidator = [isLogined, authRole, checkPermission]
const createCategoryValidator = [isLogined, authRole, checkPermission,
    ...createCategorySchemaValidate, async (req, res, next) => {
        try {
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('categorys/create.pug', {
                    frontEndURL: process.env.FRONTENDURL,
                    user: req.user,
                    name: req.body.name,
                    path: '/categorys/create',
                    status: false,
                    msg: 'Thêm mới danh mục không thành công!',
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

const showEditCategoryValidator = [
    isLogined, authRole, checkPermission,
    ...paginationSchemaValidate,
    async (req, res, next) => {
        const errorsValidator = validationResult(req);
        if (!errorsValidator.isEmpty()) {
            return res.status(403).render('categorys/edit.pug', {
                frontEndURL: process.env.FRONTENDURL,
                user: req.user,
                path: '/categorys',
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


const editCategoryValidator = [isLogined, authRole, checkPermission,
    ...editCategorySchemaValidate, async (req, res, next) => {
        try {
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('categorys/edit.pug', {
                    frontEndURL: process.env.FRONTENDURL,
                    user: req.user,
                    path: '/categorys',
                    status: false,
                    msg: 'Chỉnh sửa danh mục không thành công!',
                    category: {
                        id: +req.params.id,
                        ten: req.body.name
                    },
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

const deleteCategoryValidator = [isLogined, authRole, checkPermission,
    ...deleteCategorySchemaValidate, async (req, res, next) => {
        const erorrValidates = validationResult(req);
        if (!erorrValidates.isEmpty()) {
            return res.status(403).json({
                message: 'Id danh mục không hợp lệ!',
                statusCode: 403,
                statusText: 'error client'
            })
        }
        next();
    }
]


module.exports = {
    getCategorysValidator,
    showCategoryCreateValidator,
    createCategoryValidator,
    showCategoryCreateValidator,
    showEditCategoryValidator,
    editCategoryValidator,
    deleteCategoryValidator
}