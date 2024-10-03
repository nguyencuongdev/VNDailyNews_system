const Sequelize = require('sequelize')
const dotenv = require('dotenv');
const { database } = require('../configs');
dotenv.config();
const mysql2 = require('mysql2');

const sequelize = new Sequelize(
    database.name,
    database.username,
    database.password,
    {
        dialect: database.dialect,
        dialectModule: mysql2,
        host: database.host,
        port: database.port,
        timezone: '+07:00'
    }
);

module.exports = sequelize 