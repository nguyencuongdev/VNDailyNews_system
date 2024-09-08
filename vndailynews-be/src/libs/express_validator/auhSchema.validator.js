const { body } = require('express-validator');
const { User } = require('../../models');

const loginSchemaValidate = [
    body('account')
        .isString()
        .escape().withMessage('Tài khoản không hợp lệ!')
        .notEmpty().withMessage('Tài khoản không được để trống')
        .custom(async value => {
            const regx = new RegExp(/^[a-z0-9A-Z]*$/);
            if (!regx.test(value)) {
                throw new Error('Tên tài khoản không hợp lệ!')
            }
        }),
    body('password')
        .isString()
        .escape().withMessage('mật khẩu không hợp lệ!')
        .notEmpty().withMessage('Mật khẩu không được để trống')
];

const registerSchemaValidate = [
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
    body('firstName').isString()
        .escape().withMessage('Họ đệm không hợp lệ!')
        .notEmpty().withMessage('Họ đệm không được để trống'),
    body('lastName').isString()
        .escape().withMessage('Tên không hợp lệ!')
        .notEmpty().withMessage('Tên không được để trống'),
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
    body('password')
        .isString()
        .escape().withMessage('Mật khẩu không hợp lệ!')
        .notEmpty().withMessage('Mật khẩu không được để trống')
        .custom(async value => {
            if (value.length < 8)
                throw new Error('Mật khẩu phải có độ dài tối thiểu 8 ký tự!')
            if (value.length > 20)
                throw new Error('Mật khẩu không được lớn hơn 20 ký tự')
            const regx = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/);
            if (!regx.test(value)) {
                throw new Error('Mật khẩu phải chứa ít nhất 1 ký tự số, 1 chữ cái, 1 ký tự đặc biệt');
            }
        }),
    body('confirmPassword')
        .isString()
        .escape().withMessage('Mật khẩu xác nhận không hợp lệ!')
        .notEmpty().withMessage('Mật khẩu xác nhận không được để trống')
        .custom(async (value, { req }) => {
            if (value !== req.body.password)
                throw new Error('Mật khẩu xác nhận không trùng với mật khẩu')
        })
];
const changePasswordSchemaValidate = [
    body('passwordNew').isString()
        .escape().withMessage('Mật khẩu mới không hợp lệ!')
        .notEmpty().withMessage('Mật khẩu mới không được để trống')
        .custom(async value => {
            if (value.length < 8)
                throw new Error('Mật khẩu mới phải có độ dài tối thiểu 8 ký tự!')
            if (value.length > 20)
                throw new Error('Mật khẩu mới không được lớn hơn 20 ký tự')
            const regx = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,255}$/);
            if (!regx.test(value)) {
                throw new Error('Mật khẩu mới phải chứa ít nhất 1 ký tự số, 1 chữ cái, 1 ký tự đặc biệt');
            }
        }),
    body('confirmPassword')
        .isString()
        .escape().withMessage('Mật khẩu xác nhận không hợp lệ!')
        .notEmpty().withMessage('Mật khẩu xác nhận không được để trống')
        .custom(async (value, { req }) => {
            if (value !== req.body.passwordNew)
                throw new Error('Mật khẩu xác nhận không trùng với mật khẩu mới')
        })
];

const forgotPasswordSchemaValidate = [
    body('account').isString().escape().notEmpty().withMessage('Tải khoản là bắt buộc!')
        .custom(async value => {
            const regx = new RegExp(/^[a-z0-9]{8,50}$/);
            if (!regx.test(value)) {
                throw new Error('Tên tài khoản không hợp lệ');
            }
        }),
    body('email').isString().notEmpty().withMessage('Email là bắt buộc!')
        .isEmail().withMessage('Email không hợp lệ!')
];
module.exports = {
    loginSchemaValidate,
    registerSchemaValidate,
    forgotPasswordSchemaValidate,
    changePasswordSchemaValidate
}