'use strict';
module.exports = (sequelize, DataTypes) => {
  const invoiceReport = sequelize.define('invoiceReport', {
    userID: DataTypes.INTEGER,
    filename: DataTypes.STRING,
    reportFileName: DataTypes.STRING,
    token: DataTypes.STRING,
    date: DataTypes.STRING
  }, {
    timestamps: true,
    paranoid: true
  });
  invoiceReport.associate = function (models) {
    invoiceReport.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };
  return invoiceReport;
};