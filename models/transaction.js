'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'usuario'
      });
    }
  }

  Transaction.init(
    {
      userId: { type: DataTypes.INTEGER, allowNull: false },
      monto: { type: DataTypes.FLOAT, allowNull: false },
      tipo: { type: DataTypes.STRING, allowNull: false }, // ingreso | gasto
      descripcion: { type: DataTypes.STRING },
      servicioId: { type: DataTypes.INTEGER }
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'Transactions'
    }
  );

  return Transaction;
};
