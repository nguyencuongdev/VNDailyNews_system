const { DataTypes } = require('sequelize');
const { database } = require('../utils');

const News = database.define('News', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    tieude: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    noidungtomtat: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    noidungchitiet: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    anhdaidien: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    soluotxem: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    nguoidung_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    trangthai: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    tableName: 'baidang',
    timestamps: true,
    createdAt: 'ngaydang',
    updatedAt: 'ngaysua'
})

module.exports = News;