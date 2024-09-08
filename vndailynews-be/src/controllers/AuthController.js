const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User } = require('../models');

const authController = {
    async showForgotPassword(_, res) {
        return res.render('forgot-password.pug', {
            account: '',
            email: '',
            errors: []
        });
    },
    async handleForgotPassword(req, res) {
        const resultValidate = validationResult(req);
        if (!resultValidate.isEmpty()) {
            return res.render('forgot-password.pug', {
                account: req.body.account,
                email: req.body.email,
                errors: resultValidate.array()
            });
        }

        const user = await User.findOne({
            where: {
                email: req.body.email,
                taikhoan: req.body.account
            }
        })

        if (!user)
            return res.render('forgot-password.pug', {
                message: 'Tài khoản này không tồn tại!',
                account: req.body.account,
                email: req.body.email,
            });
        return res.render('change-password.pug', {
            account: user.taikhoan,
            email: user.email,
            passwordNew: '',
            confirmPassword: '',
        });
    },
    async handleChangePassword(req, res) {
        const resultValidate = validationResult(req);
        if (!resultValidate.isEmpty()) {
            return res.render('change-password.pug', {
                account: req.body.account,
                email: req.body.email,
                passwordNew: req.body.passwordNew,
                confirmPassword: req.body.confirmPassword,
                errors: resultValidate.array()
            });
        }
        const saltRounds = Number(process.env.BCRYPT_SALT);
        let passwordHash = bcrypt.hashSync(req.body.passwordNew, saltRounds);
        await User.update(
            { matkhau: passwordHash },
            {
                where: {
                    taikhoan: req.body.account,
                    email: req.body.email
                }
            })
        return res.render('change-password.pug', {
            msg: 'Thay đổi mật khẩu thành công!',
            status: true,
            errors: []
        })
    },
    async showRegister(_, res) {
        return res.render('register.pug', {
            account: '',
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: '',
            errors: []
        });
    },
    async handleRegister(req, res) {
        try {
            const resultValidate = validationResult(req);
            if (!resultValidate.isEmpty()) {
                return res.render('register.pug', {
                    account: req.body.account,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    password: req.body.password,
                    confirmPassword: req.body.confirmPassword,
                    email: req.body.email,
                    phone: req.body.phone,
                    errors: resultValidate.array()
                });
            }
            const saltRounds = Number(process.env.BCRYPT_SALT);
            let hashPassword = bcrypt.hashSync(req.body.password, saltRounds);
            let nameDisplay = req.body.firstName + ' ' + req.body.lastName;
            const user = await User.create({
                taikhoan: req.body.account,
                tenhienthi: nameDisplay,
                vaitro_id: 3,
                matkhau: hashPassword,
                email: req.body.email,
                sdt: req.body.phone,
                trangthai: true,
            });
            user.save();
            return res.render('register.pug', {
                msg: 'Đăng ký thành công!',
                status: true,
                errors: []
            })
        } catch (err) {
            return res.redirect('/500');
        }
    },
    async showLogin(req, res) {
        const { accessToken } = req.cookies;
        jwt.verify(accessToken, process.env.JWT_SECRET_KEY, (err) => {
            if (err) {
                return res.render('login.pug', {
                    account: '',
                    password: '',
                    errors: []
                });
            }
            return res.redirect('/news');
        });
    },
    async hanldeLogin(req, res) {
        try {
            const resultValidate = validationResult(req);
            const { account, password } = req.body;
            if (!resultValidate.isEmpty()) {
                return res.render('login.pug', {
                    account: account,
                    password: password,
                    errors: resultValidate.array()
                });
            }
            const user = await User.findOne({
                where: {
                    taikhoan: account,
                }
            });
            if (!user) {
                return res.render('login.pug', {
                    account,
                    password,
                    message: 'Tài khoản của bạn không tồn tại!'
                })
            }

            const comparePassword = await bcrypt.compare(password, user.matkhau);
            if (user && comparePassword) {
                if (!user.trangthai) {
                    return res.render('login.pug', {
                        account,
                        password,
                        message: 'Tài khoản của bạn đã bị khóa!'
                    })
                }
                const acessToken = jwt.sign({
                    id: user.id,
                    tenhienthi: user.tenhienthi,
                    vaitro_id: user.vaitro_id
                }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

                res.cookie('accessToken', acessToken, {
                    // httpOnly: true,
                    // secure: process.env.NODE_ENV === 'production',
                    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 day
                });

                return res.redirect('/news');
            }
            return res.render('login.pug', {
                account,
                password,
                message: 'Tài khoản hoặc mật khẩu không đúng!'
            })
        } catch (err) {
            return res.redirect('/500');
        }
    },
    async handleLogout(req, res) {
        try {
            const { accessToken } = req.cookies;
            const data = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            if (data) {
                res.clearCookie('accessToken');
                return res.redirect('/login');
            }
        }
        catch (e) {
            res.clearCookie('accessToken');
            res.status(403).redirect('/404');
        }
    }
}

module.exports = authController;