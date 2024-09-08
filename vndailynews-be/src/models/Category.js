const { DataTypes } = require('sequelize');
const { database } = require('../utils');
const Category = database.define('Category', {
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
    }
}, {
    tableName: 'danhmuc',
    timestamps: false,
});

Category.prototype.getCategorys = async () => {
    const categorys = await Category.findAll({
        order: [
            ['ten', 'DESC']
        ]
    });
    return categorys;
}

module.exports = Category;
