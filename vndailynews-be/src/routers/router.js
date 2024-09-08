const Router = require('express').Router();

Router.use('/', require('./auth'));
Router.use('/news', require('./news'));
Router.use('/categorys', require('./category'));
Router.use('/tags', require('./tag'));
Router.use('/users', require('./user'));
Router.use('/roles', require('./roles'));
Router.use('/permissions', require('./permissions'));

Router.get('/404', (_, res) => {
    res.render('404.pug');
})

Router.get('/500', (_, res) => {
    res.render('500.pug');
})

Router.get('*', (_, res) => {
    res.render('404.pug');
})

module.exports = Router;