const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const List = sequelize.define('List', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
    },
},
    {
        paranoid: true,
        deletedAt: "deletedAt",
    }
);


module.exports = List;

