const Sequelize = require('sequelize')
const dotenv = require('dotenv');
const { database } = require('../configs');
dotenv.config();

const sequelize = new Sequelize(
    database.name,
    database.username,
    database.password, {
    dialect: database.dialect,
    host: database.host,
    port: database.port,
    timezone: '+07:00'
});

module.exports = sequelize 