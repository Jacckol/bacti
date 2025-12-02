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
      },

      nombre: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      telefono: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      direccion: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "empleadores",
      timestamps: true,
    }
  );

  // ==========================================================
  // 🔥 RELACIÓN CORRECTA
  // Cada Empleador pertenece a 1 usuario
  // ==========================================================
  Empleador.associate = (models) => {
    Empleador.belongsTo(models.User, {
      foreignKey: "userId",
      as: "usuario",
    });
  };

  return Empleador;
};
