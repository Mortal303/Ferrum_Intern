'use strict';
module.exports = (sequelize, DataTypes) => {
  const registerService = sequelize.define('registerService', {
    userID: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    serviceType: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    info: DataTypes.STRING,
    status:DataTypes.STRING,
  }, {
    timestamps: true,
    paranoid: true
  });
  registerService.associate = function (models) {
    // associations can be defined here
    registerService.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return registerService;
};