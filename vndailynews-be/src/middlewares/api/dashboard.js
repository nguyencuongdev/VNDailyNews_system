const { validationResult } = require('express-validator');
const { query } = require('express-validator');

const getDashboardNewsListValidator = [
    query('page').isNumeric().escape().withMessage('Tham số page là bắt buộc!'),
    query('limit').isNumeric().escape().withMessage('Tham số limit là bắt buộc!'),
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
    getDashboardNewsListValidator
}