'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Trabajador extends Model {
    static associate(models) {
      // ❗ NO DEFINIMOS belongsTo AQUÍ
      // La asociación está en models/index.js
    }
  }

  Trabajador.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telefono: {
        type: DataTypes.STRING,
        allowNull: true
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: true
      },
      categoria: {
        type: DataTypes.STRING,
        allowNull: true
      },
      experiencia: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      horario: {
        type: DataTypes.STRING,
        allowNull: true
      },
      fotoPerfil: {
        type: DataTypes.STRING,
        allowNull: true
      },

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
      modelName: 'Trabajador',
      tableName: 'trabajadores',
      timestamps: true
    }
  );

  return Trabajador;
};
