const { body, param } = require('express-validator');
const { paginationSchemaValidate } = require('./commonSchema.validator');

const createNewSchemaValidate = [
    body('title').isString().notEmpty().withMessage('Tiêu đề của bài đăng là bắt buộc!'),
    body('summary').isString().notEmpty().withMessage('Nội dung tóm tắt của bài đăng là bắt buộc'),
];

const editNewSchemaValidate = [
    ...createNewSchemaValidate
];

const deleteNewsSchemaValidate = [
    ...paginationSchemaValidate,
    body('id').isNumeric().escape().notEmpty().withMessage('ID của bài đăng không hợp lệ!'),
    body('totalNewsOnPage').isNumeric().notEmpty().escape().withMessage('Tổng số tin tức trên một trang không hợp lệ!'),
];

const updateStatusNewsSchemaValidate = [
    param('id').isString().escape().notEmpty().withMessage('ID của bài đăng không hợp lệ!'),
];


module.exports = {
    createNewSchemaValidate,
    editNewSchemaValidate,
    deleteNewsSchemaValidate,
    updateStatusNewsSchemaValidate
};