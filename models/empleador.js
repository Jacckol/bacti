'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PerfilEmpleador extends Model {
    static associate(models) {
      PerfilEmpleador.belongsTo(models.Empleador, {
        foreignKey: 'empleadorId',
        as: 'empleador',
      });
    }
  }

  PerfilEmpleador.init(
    {
      empleadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'empleadores',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      categoria: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      experiencia: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      habilidades: {
        type: DataTypes.ARRAY(DataTypes.STRING), // PostgreSQL soporta arrays
        allowNull: true,
      },
     // calificacion: {
       // type: DataTypes.FLOAT,
       // allowNull: true,
     // },
     // trabajosCompletados: {
      //  type: DataTypes.INTEGER,
        //allowNull: true,
     // },
    },
    {
      sequelize,
      modelName: 'PerfilEmpleador',
      tableName: 'perfiles_empleadores',
      timestamps: true,
    }
  );

  return PerfilEmpleador;
};
