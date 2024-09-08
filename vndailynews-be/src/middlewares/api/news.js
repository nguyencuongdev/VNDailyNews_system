const { validationResult } = require('express-validator');
const { query, param } = require('express-validator');


const getInforDetailNewsValidator = [
    param('id').isNumeric().escape().withMessage('Tham số id là không hợp lệ!'),
    async (req, res, next) => {
        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty()) {
            const errors = errorsValidate.array();
            return res.status(403).json({
                status: 403,
                statusText: 'Thất bại',
                message: {
                    path: errors[0].path,
                    message: errors[0].msg
                }
            })
        }
        next();
    }]

const updateAmountSeenNewsValidator = [
    param('id').isNumeric().escape().withMessage('Tham số id là không hợp lệ!'),
    async (req, res, next) => {
        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty()) {
            const errors = errorsValidate.array();
            return res.status(403).json({
                status: 403,
                statusText: 'Thất bại',
                message: {
                    path: errors[0].path,
                    message: errors[0].msg
                }
            })
        }
        next();
    }]

const getNewsListBySearchValidator = [
    query('page').isNumeric().escape().withMessage('Tham số page là bắt buộc!'),
    query('limit').isNumeric().escape().withMessage('Tham số limit là bắt buộc!'),
    query('searchValue').optional().isString().escape().withMessage('Tham số search là không hợp lệ!'),
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
    }]


const getNewsNewListValidator = [
    query('limit').optional().isNumeric().escape().withMessage('Tham số limit không hợp lệ!'),
    async (req, res, next) => {
        const errorsValidate = validationResult(req);
        if (!errorsValidate.isEmpty()) {
            const errors = errorsValidate.array();
            return res.status(403).json({
                status: 403,
                statusText: 'Thất bại',
                message: {
                    path: errors[0].path,
                    message: errors[0].msg
                }
            })
        }
        next();
    }
]

const getNewsProposeListValidator = getNewsNewListValidator;

module.exports = {
    getInforDetailNewsValidator,
    getNewsNewListValidator,
    getNewsProposeListValidator,
    getNewsListBySearchValidator,
    updateAmountSeenNewsValidator
}