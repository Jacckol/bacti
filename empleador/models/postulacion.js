"use strict";

module.exports = (sequelize, DataTypes) => {
  const Postulacion = sequelize.define(
    "Postulacion",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 🔹 Clave foránea: Usuario
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 🔹 Clave foránea: Trabajo
      trabajoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      // 🔹 Mensaje opcional
      mensaje: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      // 🔹 Estado de la postulación
      estado: {
        type: DataTypes.ENUM("pendiente", "aceptado", "rechazado"),
        defaultValue: "pendiente",
      },
    },
    {
      tableName: "postulaciones",
      timestamps: true, // ✔ NECESARIO
    }
  );

  Postulacion.associate = (models) => {
    // 🔹 Relación con usuario postulante
    Postulacion.belongsTo(models.User, {
      as: "postulante",
      foreignKey: "userId",
    });

    // 🔹 Relación con trabajo
    Postulacion.belongsTo(models.Trabajo, {
      as: "trabajo",
      foreignKey: "trabajoId",
    });
  };

  return Postulacion;
};
