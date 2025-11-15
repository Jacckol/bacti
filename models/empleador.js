'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Empleador extends Model {
    static associate(models) {
      // Un empleador pertenece a un usuario
      Empleador.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'empleadorUsuario'
      });
    }
  }

  Empleador.init(
    {
      empresa: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: false
      },

      // Relación con User
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      }
    },
    {
      sequelize,
      modelName: 'Empleador',
      tableName: 'empleadores',
      timestamps: true
    }
  );

  return Empleador;
};
