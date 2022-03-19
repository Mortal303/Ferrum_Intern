'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserVerified = sequelize.define('UserVerified', {
    email: DataTypes.STRING,
    token: DataTypes.STRING,
    status: DataTypes.ENUM("0", "1"),
  }, {
    timestamps: true,
    paranoid: true
  });
  UserVerified.associate = function (models) {
    // associations can be defined here
  };
  return UserVerified;
};