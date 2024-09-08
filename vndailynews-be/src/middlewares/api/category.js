const { validationResult } = require('express-validator');
const { query, param } = require('express-validator');

const getNewsListOfCategoryValidator = [
    query('page').optional().isNumeric().escape().withMessage('Tham số page là không hợp lệ!'),
    query('limit').optional().isNumeric().escape().withMessage('Tham số limit là không hợp lệ!'),
    param('id').isNumeric().escape().withMessage('Tham số id là không hợp lệ!'),
    async (req, res, next) => {
        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty()) {
            const errors = errorsValidate.array();
            return res.status(403).json({
                status: 403,
                statusText: 'Thất bại',
                message: errors.map(err => {
                    return {
                        path: err.path,
                        message: err.msg
                    }
                })
            })
        }
        next();
    }
]

module.exports = {
    getNewsListOfCategoryValidator
}