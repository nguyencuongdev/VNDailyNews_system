const file = require('./file');
const { formatDate, formatDateTime } = require('./formatDate');
const pagination = require('./pagination');

module.exports = {
    database: require('./database'),
    formatDate,
    ...file,
    ...pagination,
    formatDateTime
}