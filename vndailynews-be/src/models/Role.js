const { DataTypes } = require('sequelize');
const { database } = require('../utils');

const Role = database.define('Role', {
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
    quyen_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ghichu: {
        type: DataTypes.TEXT('medium'),
        allowNull: true
    }
}, {
    tableName: 'vaitro',
    timestamps: false,
})


module.exports = Role;