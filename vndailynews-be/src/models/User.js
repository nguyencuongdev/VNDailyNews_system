const { DataTypes } = require('sequelize');
const { database } = require('../utils');

const User = database.define('User', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    taikhoan: {
        type: DataTypes.CHAR,
        allowNull: false,
        unique: true
    },
    matkhau: {
        type: DataTypes.CHAR,
        allowNull: false,
    },
    tenhienthi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    vaitro_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sdt: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    trangthai: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    ghichu: {
        type: DataTypes.TEXT('medium'),
        allowNull: true
    }
}, {
    tableName: 'nguoidung',
    timestamps: false,
})


module.exports = User;