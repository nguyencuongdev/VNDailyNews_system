const Router = require('express').Router();
const { authController } = require('../controllers');
const { changePasswordSchemaValidate, forgotPasswordSchemaValidate, loginSchemaValidate, registerSchemaValidate } = require('../libs/express_validator');


Router.get('/', (_, res) => { return res.redirect('/news'); })

Router.get('/login', authController.showLogin);
Router.post('/login', loginSchemaValidate, authController.hanldeLogin);

Router.get('/register', authController.showRegister);
Router.post('/register', registerSchemaValidate, authController.handleRegister);

Router.get('/forgot-password', authController.showForgotPassword);
Router.post('/forgot-password', forgotPasswordSchemaValidate, authController.handleForgotPassword);
Router.put('/change-password', changePasswordSchemaValidate, authController.handleChangePassword);

Router.get('/logout', authController.handleLogout);

module.exports = Router;