const { query, body } = require('express-validator');

const paginationSchemaValidate = [
    query('p').isNumeric().escape().notEmpty().withMessage('Tham số p không hợp lệ'),
    query('fposc').isNumeric().escape().notEmpty().withMessage('Tham số fposc không hợp lệ'),
    query('lposc').isNumeric().escape().notEmpty().withMessage('Tham số lposc không hợp lệ')
];

const passwordSchemaValidate = [
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
]


module.exports = {
    paginationSchemaValidate,
    passwordSchemaValidate
};