'use strict';
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    email_verified: DataTypes.ENUM("0", "1"),
  }, {
    timestamps: true,
    paranoid: true
  });
  Users.associate = function (models) {
    Users.hasMany(models.forgotPassword, {
      foreignKey: "userId",
    });
  };
  return Users;
};