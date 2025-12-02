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
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      trabajoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mensaje: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      estado: {
        type: DataTypes.ENUM("pendiente", "aceptado", "rechazado"),
        defaultValue: "pendiente",
      },
    },
    {
      tableName: "postulaciones",
      timestamps: true,
    }
  );

  Postulacion.associate = (models) => {
    Postulacion.belongsTo(models.User, {
      as: "postulante",
      foreignKey: "userId",
    });

    Postulacion.belongsTo(models.Trabajo, {
      as: "trabajo",
      foreignKey: "trabajoId",
    });
  };

  return Postulacion;
};
