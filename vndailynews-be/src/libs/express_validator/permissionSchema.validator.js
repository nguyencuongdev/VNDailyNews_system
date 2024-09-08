const { body, query, param } = require('express-validator');
const { Op } = require('sequelize');
const { paginationSchemaValidate } = require('./commonSchema.validator');
const { Permission } = require('../../models');

const getPermissionsSchemaValidator = [
    ...paginationSchemaValidate,
    query('q').optional().isString().escape().withMessage('Tham số q không hợp lệ')
];

const createPermissionSchemaValidate = [
    body('name').isString().escape().withMessage('Tên quyền không hợp lệ!').custom(async value => {
        let valueTrimed = value.trim();
        if (!valueTrimed) {
            throw new Error('Tên quyền không hợp lệ!');
        }
        const permissions = await Permission.findAll();
        const checkName = permissions.some((permission) => permission.ten === value);
        if (checkName) {
            throw new Error('Quyền đã tồn tại!');
        }
    }),
    body('note').optional().isString().escape().withMessage('Thông tin ghi chú không hợp lệ!')
]

const editPermissionSchemaValidate = [
    ...paginationSchemaValidate,
    param('id').isNumeric().escape().withMessage('Id quyền không hợp lệ'),
    body('name').isString().withMessage('Tên quyền không hợp lệ!')
        .notEmpty().trim().withMessage('Tên quyền không được để trống')
        .custom(async (value, { req }) => {
            const permission = await Permission.findOne({
                where: {
                    ten: value,
                    id: {
                        [Op.ne]: +req.params.id
                    }
                }
            })
            if (permission) {
                throw new Error("Quyền đã tồn tại trong hệ thống!");
            }
        }),
    body('note').optional().isString().escape().withMessage('Thông tin ghi chú không hợp lệ!')
];

module.exports = {
    getPermissionsSchemaValidator,
    createPermissionSchemaValidate,
    editPermissionSchemaValidate
}