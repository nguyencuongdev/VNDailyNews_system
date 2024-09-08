const { DataTypes } = require('sequelize');
const { database } = require('../utils');

const Permission = database.define('Permission', {
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
    ghichu: {
        type: DataTypes.TEXT('medium'),
        allowNull: true
    }
}, {
    tableName: 'quyen',
    timestamps: false,
})

module.exports = Permission;
