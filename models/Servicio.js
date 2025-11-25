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
    },
    {
      tableName: "servicios",   // ⭐ IMPORTANTE: nombre exacto en minúsculas
      freezeTableName: true     // ⭐ Evita que Sequelize pluralice
    }
  );

  return Servicio;
};
