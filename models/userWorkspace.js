const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Space = require('./space');

const UserWorkspace = sequelize.define('UserWorkspace', {
    // add 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    role: {
        type: DataTypes.ENUM("admin", "member"),
        allowNull: false,
        defaultvalue: "member",
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

module.exports = UserWorkspace;