
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const UserWorkspace = require('./userWorkspace');
const Workspace = require('./workspace');

const Space = sequelize.define( 'Space', {
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
    color: {
        type: DataTypes.STRING,
        allowNull: false,
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

Space.belongsToMany(User, { through: UserWorkspace } );
Space.belongsToMany(Workspace, { through: 'SpaceWorkspace' })

module.exports = Space