const Workspace = require("./workspace");
const Sequelize = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "users",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING(191),
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING(191),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING(191),
      allowNull: false,
    },
    deletedAt: {
      type: Sequelize.DATE,
      allowNull: true,
    },
  },
  {
    paranoid: true,
    deletedAt: "deletedAt",
  }
);


User.hasMany(Workspace);
Workspace.belongsTo(User);

module.exports = User;
