'use strict';
module.exports = (sequelize, DataTypes) => {
  const forgotPassword = sequelize.define('forgotPassword', {
    email: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    date: DataTypes.DATE
  }, {
    timestamps: true,
    paranoid: true
  });
  forgotPassword.associate = function (models) {
    forgotPassword.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return forgotPassword;
};