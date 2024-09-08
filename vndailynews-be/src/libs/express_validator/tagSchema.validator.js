const { body, query, param } = require('express-validator');
const { Op } = require('sequelize');
const { Tag, Category } = require('../../models');
const { paginationSchemaValidate } = require('./commonSchema.validator');


const getTagsSchemaValidator = [
    ...paginationSchemaValidate,
    query('q').optional().isString().escape().withMessage('Tham số q không hợp lệ')
];

const createTagSchemaValidate = [
    body('name').isString().escape().notEmpty().withMessage('Tên thể loại là bắt buộc!')
        .custom(async (value, { req }) => {
            let valueTrimed = value.trim();
            if (!valueTrimed) {
                throw new Error('Tên Thể loại không hợp lệ!');
            }
            const tag = await Tag.findOne({
                where: {
                    ten: valueTrimed,
                    danhmuc_id: +req.body.categoryID
                }
            });

            if (tag) {
                throw new Error('Thể loại đã tồn tại trong danh mục này');
            }
        }),
    body('categoryID').isNumeric().escape().notEmpty().withMessage('Danh mục là bắt buộc!')
        .custom(async value => {
            const category = await Category.findOne({
                where: {
                    id: value
                }
            })
            if (!category) {
                throw new Error('Danh mục không hợp lệ!');
            }

        })
];

const editTagSchemaValidate = [
    param('id').isNumeric().escape().withMessage('Id không hợp lệ'),
    body('name').isString().escape().notEmpty().withMessage('Tên thể loại là bắt buộc!')
        .custom(async (value, { req }) => {
            let valueTrimed = value.trim();
            if (!valueTrimed) {
                throw new Error('Tên Thể loại không hợp lệ!');
            }
            const tag = await Tag.findOne({
                where: {
                    ten: valueTrimed,
                    danhmuc_id: +req.body.categoryID,
                    id: {
                        [Op.ne]: +req.params.id
                    }
                }
            });

            if (tag) {
                throw new Error('Đã có thể loại với thông tin trên tồn tại trong danh mục này');
            }
        }),
    body('categoryID').isNumeric().escape().notEmpty().withMessage('Danh mục là bắt buộc!')
        .custom(async value => {
            const category = await Category.findOne({
                where: {
                    id: value
                }
            })
            if (!category) {
                throw new Error('Danh mục không hợp lệ!');
            }

        }),
];

const deleteTagSchemaValidate = [
    ...paginationSchemaValidate,
    body('id').isNumeric().escape().notEmpty().withMessage('ID của danh mục không hợp lệ!'),
    body('totalTagOnPage').isNumeric().notEmpty().escape().withMessage('Tổng số thể loại trên một trang không hợp lệ!'),
];

module.exports = {
    getTagsSchemaValidator,
    createTagSchemaValidate,
    editTagSchemaValidate,
    deleteTagSchemaValidate
};