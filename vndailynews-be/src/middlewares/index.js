const auth = require('./auth');
const tag = require('./tag');
const category = require('./category');
const user = require('./user_mangement');
const news = require('./news');
const role = require('./role');
const permission = require('./permission');

module.exports = {
    ...auth,
    ...tag,
    ...category,
    ...user,
    ...news,
    ...role,
    ...permission
}