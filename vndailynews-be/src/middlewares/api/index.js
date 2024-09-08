const dashboard = require('./dashboard');
const news = require('./news');
const category = require('./category');
const tag = require('./tag');

module.exports = {
    ...dashboard,
    ...news,
    ...category,
    ...tag
}