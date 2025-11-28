"use strict";

module.exports = (sequelize, DataTypes) => {
  const Empleador = sequelize.define(
    "Empleador",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },

      empresa: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      ruc: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      responsable: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      foto_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "empleadores",
      timestamps: true,
    }
  );

  // ❗ NO DEFINIMOS ASOCIACIONES AQUÍ
  // TODAS ESTÁN EN models/index.js

  Empleador.associate = function (models) {
    // Vacío para evitar errores de Sequelize,
    // pero dejado por compatibilidad
  };

  return Empleador;
};
