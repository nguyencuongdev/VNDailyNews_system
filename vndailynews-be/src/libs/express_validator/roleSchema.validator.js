const { body, query, param } = require('express-validator');
const { Op } = require('sequelize');
const { Role, Permission } = require('../../models');
const { paginationSchemaValidate } = require('./commonSchema.validator');


const getRolesSchemaValidator = [
    ...paginationSchemaValidate,
    query('q').optional().isString().escape().withMessage('Tham số q không hợp lệ')
];

const createRoleSchemaValidate = [
    body('name').isString().escape().notEmpty().withMessage('Tên vai trò là bắt buộc!')
        .custom(async (value) => {
            let valueTrimed = value.trim();
            if (!valueTrimed) {
                throw new Error('Tên vai trò không hợp lệ!');
            }
            const role = await Role.findOne({
                where: {
                    ten: valueTrimed,
                }
            });

            if (role) {
                throw new Error('Vai trò đã tồn trong hệ thống này');
            }
        }),
    body('permissionID').isString().escape().notEmpty().withMessage('Quyền là bắt buộc!')
        .custom(async value => {
            const permission = await Permission.findOne({
                where: {
                    id: value
                }
            })

            if (!permission)
                throw new Error('Quyền không hợp lệ!');

        }),
    body('note').optional().isString().escape().withMessage('Thông tin ghi chú không hợp lệ!')
];

const editRoleSchemaValidate = [
    param('id').isNumeric().escape().withMessage('Id không hợp lệ'),
    body('name').isString().escape().notEmpty().withMessage('Tên vai trò là bắt buộc!')
        .custom(async (value, { req }) => {
            let valueTrimed = value.trim();
            if (!valueTrimed) {
                throw new Error('Tên vai trò không hợp lệ!');
            }
            const role = await Role.findOne({
                where: {
                    ten: valueTrimed,
                    id: {
                        [Op.ne]: +req.params.id
                    }
                }
            });

            if (role) {
                throw new Error('Vai trò đã tồn tại!');
            }
        }),
    body('permissionID').isString().escape().notEmpty().withMessage('Quyền là bắt buộc!')
        .custom(async value => {
            const permission = await Permission.findOne({
                where: {
                    id: value
                }
            })
            if (!permission) {
                throw new Error('Quyền không hợp lệ!');
            }

        }),
    body('note').optional().isString().escape().withMessage('Thông tin ghi chú không hợp lệ!')
];


module.exports = {
    getRolesSchemaValidator,
    createRoleSchemaValidate,
    editRoleSchemaValidate
};