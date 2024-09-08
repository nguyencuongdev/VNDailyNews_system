const { validationResult } = require('express-validator');
const { Category } = require('../models');
const { isLogined, authRole } = require('./auth');
const {
    createTagSchemaValidate, editTagSchemaValidate, deleteTagSchemaValidate,
    getTagsSchemaValidator,
    paginationSchemaValidate
}
    = require('../libs/express_validator');


const checkPermission = (req, res, next) => {
    if (![1, 3].includes(req.permission)) {
        return res.status(403).render('404.pug');
    }
    next();
}

const getTagsValidator = [isLogined, authRole, checkPermission,
    ...getTagsSchemaValidator,
    async (req, res, next) => {
        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty())
            return res.status(403).redirect('/404')
        next();
    }
]


const showTagCreateValidator = [isLogined, authRole, checkPermission]
const createTagValidator = [isLogined, authRole, checkPermission,
    ...createTagSchemaValidate, async (req, res, next) => {
        try {
            const category = new Category();
            const categoryList = await category.getCategorys();
            const errorsValidate = validationResult(req);
            if (!errorsValidate.isEmpty()) {
                return res.status(403).render('tags/create.pug', {
                    user: req.user,
                    name: req.body.name,
                    categoryID: req.body.categoryID,
                    categorys: categoryList,
                    path: '/tags/create',
                    status: false,
                    msg: 'Thêm mới thể loại không thành công!',
                    errors: errorsValidate.array(),
                    p: 0,
                    fposc: 0,
                    lposc: 3
                })
            }
            req.categoryList = categoryList
            next();
        } catch (err) {
            return res.status(500).redirect('/500');

        }
    }
]

const showEditTagValidator = [
    isLogined, authRole, checkPermission,
    ...paginationSchemaValidate,
    async (req, res, next) => {
        try {
            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).redirect('/404');
            }

            const category = new Category();
            const categoryList = await category.getCategorys();
            req.categoryList = categoryList;
            next();
        } catch (err) {
            return res.status(500).redirect('/500');

        }
    }
]


const editTagValidator = [isLogined, authRole, checkPermission,
    ...editTagSchemaValidate, async (req, res, next) => {
        try {
            const category = new Category();
            const categoryList = await category.getCategorys();

            const errorsValidator = validationResult(req);
            if (!errorsValidator.isEmpty()) {
                return res.status(403).render('tags/edit.pug', {
                    user: req.user,
                    path: '/tags',
                    status: false,
                    id: +req.params.id,
                    name: req.body.name,
                    categoryID: +req.body.categoryID,
                    categorys: categoryList,
                    msg: 'Chỉnh sửa thể loại không thành công!',
                    errors: errorsValidator.array(),
                    p: req.query.p,
                    fposc: req.query.fposc,
                    lposc: req.query.lposc,
                })
            }
            req.categoryList = categoryList;
            next();
        } catch (err) {
            return res.status(500).redirect('/500');
        }
    }
]

const deleteTagValidator = [isLogined, authRole, checkPermission,
    ...deleteTagSchemaValidate, async (req, res, next) => {
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
    getTagsValidator,
    showTagCreateValidator,
    createTagValidator,
    showEditTagValidator,
    editTagValidator,
    deleteTagValidator
}