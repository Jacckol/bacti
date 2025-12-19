"use strict";

module.exports = (sequelize, DataTypes) => {
  const Servicio = sequelize.define(
    "Servicio",
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
      presupuesto: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // ==================================================
      // 🔥 CAMPO ESTADO (ALINEADO CON LA BD)
      // ==================================================
      estado: {
        type: DataTypes.STRING, // ✅ CORRECTO
        allowNull: false,
        defaultValue: "activo",
      },
    },
    {
      tableName: "servicios",   // ⭐ NO SE TOCA
      freezeTableName: true,    // ⭐ NO SE TOCA
      timestamps: true,         // createdAt / updatedAt
    }
  );

  return Servicio;
};
