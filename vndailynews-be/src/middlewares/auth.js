const jwt = require('jsonwebtoken');
const { Role } = require('../models');

const auth = {
    async isLogined(req, res, next) {
        try {
            const { accessToken } = req.cookies;
            const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            if (payload) {
                req.user = payload;
                next();
            } else {
                res.clearCookie('accessToken');
                return res.redirect('/login');
            }
        } catch (e) {
            res.clearCookie('accessToken');
            return res.redirect('/login');
        }
    },
    async authRole(req, res, next) {
        try {
            const user = req.user;
            const role = await Role.findOne({
                where: {
                    id: user.vaitro_id
                }
            });
            if (!role)
                return res.redirect('/404');
            req.permission = role.quyen_id;
            next();
        } catch (e) {
            return res.render('500.pug');
        }
    }
}

module.exports = auth