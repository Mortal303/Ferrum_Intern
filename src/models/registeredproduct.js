'use strict';
module.exports = (sequelize, DataTypes) => {
  const registeredProduct = sequelize.define('registeredProduct', {
    userId: DataTypes.INTEGER,
    sno: DataTypes.INTEGER,
    date: DataTypes.STRING,
    productName: DataTypes.STRING,
    barcodeResult: DataTypes.STRING,
    token: DataTypes.STRING,
  }, {
    timestamps: true,
    paranoid: true
  });
  registeredProduct.associate = function (models) {
    registeredProduct.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return registeredProduct;
};