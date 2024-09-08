const { body, query } = require('express-validator');
const { Op } = require('sequelize');
const { Role, User } = require('../../models');
const { paginationSchemaValidate } = require('./commonSchema.validator');


const getUsersSchemaValidator = [
    ...paginationSchemaValidate,
    query('q').optional().isString().escape().withMessage('Tham số q không hợp lệ')
];


const inforAccountSchemaValidate = [
    body('username').isString().escape().notEmpty().withMessage('Tên người dùng là bắt buộc!')
        .custom(async (value) => {
            let valueTrimed = value.trim();
            if (!valueTrimed) {
                throw new Error('Tên người dùng không hợp lệ!');
            }
        }),
    body('password').isString().escape().notEmpty().withMessage('Mật khẩu là bắt buộc!')
        .custom(async value => {
            if (value.length < 8) {
                throw new Error('Mật khẩu phải có tối hiểu 8 ký tự!');
            }
            if (value.length > 255) {
                throw new Error('Mật khẩu quá dài');
            }
        })
        .custom(async value => {
            const regx = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/);
            if (!regx.test(value)) {
                throw new Error('Mật khẩu phải chứa ít nhất 1 ký tự số, 1 chữ cái, 1 ký tự đặc biệt');
            }
        }),
    body('roleID').escape().notEmpty().withMessage('Vai trò là bắt buộc!')
        .custom(async (value) => {
            const role = await Role.findOne({
                where: {
                    id: +value
                }
            })
            if (!role) {
                throw new Error('Vai trò không hợp lệ!')
            }
        })
]

const createUserSchemaValidate = [
    ...inforAccountSchemaValidate,
    body('account').isString().escape().notEmpty().withMessage('Tên tải khoản là bắt buộc!')
        .custom(async value => {
            let valueTrimed = value.trim();
            if (!valueTrimed) {
                throw new Error('Tên tài khoản không hợp lệ!');
            }
        })
        .custom(async value => {
            if (value.length < 8 || value.length > 50) {
                throw new Error('Độ dài tối thiểu phải là 8 ký tự hoặc tối da là 50 ký tự!');
            }
            const regx = new RegExp(/^[a-z0-9]{8,50}$/);
            if (!regx.test(value)) {
                throw new Error('Tên tài khoản chỉ được chứa các ký tự a-z, 0-9');
            }
        })
        .custom(async (value) => {
            const user = await User.findOne({
                where: {
                    taikhoan: value
                }
            })
            if (user) {
                throw new Error('Tên tài khoản đã tồn tại!')
            }
        }),
    body('comfirmPassword').isString().escape().notEmpty().withMessage('Xác thực mật khẩu là bắt buộc!')
        .custom(async (value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu xác thực không khớp với mật khẩu!');
            }
        }),
    body('email').isString().isEmail().withMessage('Email không hợp lệ!')
        .escape().notEmpty().withMessage('Email là bắt buộc!')
        .custom(async (value) => {
            const user = await User.findOne({
                where: {
                    email: value
                }
            })
            if (user) {
                throw new Error('Email này đã đăng ký!')
            }
        }),
    body('phone').isString().escape().notEmpty().withMessage('Số điện thoại là bắt buộc!')
        .custom(async (value) => {
            const regx = new RegExp(/^0[0-9]{9,10}$/);
            if (!regx.test(value)) {
                throw new Error('Số điện thoại không hợp lệ!');
            }
        })
        .custom(async (value) => {
            const user = await User.findOne({
                where: {
                    sdt: value
                }
            })
            if (user) {
                throw new Error('Số điện thoại này đã đăng ký!')
            }
        }),
    body('status').isString().escape().notEmpty().withMessage('Trạng thái là bắt buộc!')
        .custom(async (value) => {
            if (!['1', '0'].includes(value)) {
                throw new Error('Trạng thái không hợp lệ!')
            }
        }),
    body('note').optional().isString().escape().withMessage('Thông tin ghi chú không hợp lệ!')
];

const editUserSchemaValidate = [
    body('username').isString().escape().notEmpty().withMessage('Tên người dùng là bắt buộc!')
        .custom(async (value) => {
            let valueTrimed = value.trim();
            if (!valueTrimed) {
                throw new Error('Tên người dùng không hợp lệ!');
            }
        }),
    body('password').optional().isString().escape()
        .custom(async value => {
            if (!value) return true;
            if (value.length < 8) {
                throw new Error('Mật khẩu phải có tối hiểu 8 ký tự!');
            }
            if (value.length > 255) {
                throw new Error('Mật khẩu quá dài');
            }
            const regx = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/);
            if (!regx.test(value)) {
                throw new Error('Mật khẩu phải chứa ít nhất 1 ký tự số, 1 chữ cái, 1 ký tự đặc biệt');
            }
        }),
    body('email').isString().isEmail().withMessage('Email không hợp lệ!')
        .escape().notEmpty().withMessage('Email là bắt buộc!')
        .custom(async (value, { req }) => {
            const user = await User.findOne({
                where: {
                    email: value,
                    id: {
                        [Op.ne]: req.params.id
                    }
                }
            })
            if (user) {
                throw new Error('Email này đã đăng ký!')
            }
        }),
    body('phone').isString().escape().notEmpty().withMessage('Số điện thoại là bắt buộc!')
        .custom(async (value) => {
            const regx = new RegExp(/^0[0-9]{9,10}$/);
            if (!regx.test(value)) {
                throw new Error('Số điện thoại không hợp lệ!');
            }
        })
        .custom(async (value, { req }) => {
            const user = await User.findOne({
                where: {
                    sdt: value,
                    id: {
                        [Op.ne]: req.params.id
                    }
                }
            })
            if (user) {
                throw new Error('Số điện thoại này đã đăng ký!')
            }
        }),
    body('roleID').escape().notEmpty().withMessage('Vai trò là bắt buộc!')
        .custom(async (value) => {
            const role = await Role.findOne({
                where: {
                    id: +value
                }
            })
            if (!role) {
                throw new Error('Vai trò không hợp lệ!')
            }
        }),
    body('status').isString().escape().notEmpty().withMessage('Trạng thái là bắt buộc!')
        .custom(async (value) => {
            if (!['1', '0'].includes(value)) {
                throw new Error('Trạng thái không hợp lệ!')
            }
        }),
    body('note').optional().isString().escape().withMessage('Thông tin ghi chú không hợp lệ!')
];

const deleteUserSchemaValidate = [
    ...paginationSchemaValidate,
    body('id').isNumeric().escape().notEmpty().withMessage('ID của user không hợp lệ!'),
    body('totalUserOnPage').isNumeric().notEmpty().escape().withMessage('Total tag on page không hợp lệ!'),
];

module.exports = {
    getUsersSchemaValidator,
    createUserSchemaValidate,
    editUserSchemaValidate,
    deleteUserSchemaValidate
};