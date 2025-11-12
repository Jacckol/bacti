'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trabajo extends Model {
    static associate(models) {
      // Un trabajo pertenece a un empleador
      this.belongsTo(models.Empleador, {
        foreignKey: 'empleadorId',
        as: 'empleador',
      });
    }
  }

  Trabajo.init(
    {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoria: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      ubicacion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duracion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      presupuesto: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Trabajo',
      tableName: 'trabajos',
      timestamps: true,
    }
  );

  return Trabajo;
};
