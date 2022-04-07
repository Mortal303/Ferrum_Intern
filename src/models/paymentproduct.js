'use strict';
module.exports = (sequelize, DataTypes) => {
  const paymentProduct = sequelize.define('paymentProduct', {
    userID: DataTypes.INTEGER,
    productName: DataTypes.STRING,
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    date_time: DataTypes.STRING
  }, {
    timestamps: true,
    paranoid: true
  });
  paymentProduct.associate = function(models) {
    // associations can be defined here
    paymentProduct.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return paymentProduct;
};