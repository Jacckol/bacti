"use strict";

module.exports = (sequelize, DataTypes) => {
  const Trabajo = sequelize.define(
    "Trabajo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // 🔵 NUEVO: usuario que creó el trabajo (TRABAJADOR)
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },

      // 🟠 Empleador (si lo publica un EMPLEADOR)
      empleadorId: {
        type: DataTypes.INTEGER,
        allowNull: true, // antes estaba false y ROMPÍA todo
        references: {
          model: "empleadores",
          key: "id",
        },
        onDelete: "SET NULL",
      },

      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      salario: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      categoria: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      estado: {
        type: DataTypes.ENUM("activo", "pausado", "finalizado"),
        defaultValue: "activo",
        allowNull: false,
      },
    },
    {
      tableName: "trabajos",
      timestamps: true,
    }
  );

  Trabajo.associate = (models) => {
    // Relaciones opcionales si quieres
  };

  return Trabajo;
};
