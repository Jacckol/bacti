'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trabajo extends Model {
    static associate(models) {
      // Aquí solo se asocia con User si quieres
      Trabajo.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'usuario',
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
      userId: { // ahora solo referencia a User
        type: DataTypes.INTEGER,
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
