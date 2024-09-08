const { DataTypes } = require('sequelize');
const { database } = require('../utils');

const NewsTag = database.define('NewsTag', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    baidang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    theloai_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    tableName: 'baidang_theloai',
    timestamps: false,
})

module.exports = NewsTag;
