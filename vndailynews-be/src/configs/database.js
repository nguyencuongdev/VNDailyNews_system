const dotenv = require('dotenv');
dotenv.config();

const database = {
    name: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER_NAME,
    password: process.env.DATABASE_USER_PASSWORD,
    dialect: process.env.DATABASE_SERVER,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
}

module.exports = database;