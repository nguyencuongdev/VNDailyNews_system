const { body, query, param } = require('express-validator');
const { Op } = require('sequelize');
const { Category } = require('../../models');
const { paginationSchemaValidate } = require('./commonSchema.validator');

const getCategorysSchemaValidator = [
    ...paginationSchemaValidate,
    query('q').optional().isString().escape().withMessage('Tham số q không hợp lệ')
];

const createCategorySchemaValidate = [
    body('name').isString().escape().withMessage('Tên danh mục không hợp lệ!').custom(async value => {
        let valueTrimed = value.trim();
        if (!valueTrimed) {
            throw new Error('Tên danh mục không hợp lệ!');
        }
        const categorys = await Category.findAll();
        const checkName = categorys.some((category) => category.ten === value);
        if (checkName) {
            throw new Error('Danh mục đã tồn tại!');
        }
    }),
];
const editCategorySchemaValidate = [
    ...paginationSchemaValidate,
    param('id').isNumeric().escape().withMessage('Id không hợp lệ'),
    body('name').isString().withMessage('Tên không hợp lệ!')
        .notEmpty().trim().withMessage('Tên danh mục không được để trống')
        .custom(async (value, { req }) => {
            const category = await Category.findOne({
                where: {
                    ten: value,
                    id: {
                        [Op.ne]: +req.params.id
                    }
                }
            })
            if (category) {
                throw new Error("Tên danh mục này đã tồn tại!");
            }
        })
];

const deleteCategorySchemaValidate = [
    ...paginationSchemaValidate,
    body('id').isNumeric().escape().notEmpty().withMessage('ID của danh mục không hợp lệ!'),
    body('totalCategoryOnPage').isNumeric().notEmpty().escape().withMessage('Total category on page không hợp lệ!'),
];
module.exports = {
    getCategorysSchemaValidator,
    createCategorySchemaValidate,
    editCategorySchemaValidate,
    deleteCategorySchemaValidate
}