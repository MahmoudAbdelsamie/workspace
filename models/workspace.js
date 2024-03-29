const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserWorkspace = require('./userWorkspace');
const Space = require('./space');

const Workspace = sequelize.define('Workspace', {
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
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    numPeople: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "2-5"
    },
    industry: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "IT",
    },
    userRole: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Team Leader",
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

Workspace.belongsToMany(User, { through: UserWorkspace})
Workspace.belongsToMany(Space, { through: 'SpaceWorkspace'})

module.exports = Workspace;