const { DataTypes } = require('sequelize');
const { database } = require('../utils');

const Tag = database.define('Tag', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    ten: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    danhmuc_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'theloai',
    timestamps: false,
});

module.exports = Tag;
