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

      // 🔵 Usuario que creó el trabajo (opcional)
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "SET NULL",
      },

      // 🟠 Empleador que publica el trabajo
      empleadorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
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

      // Estado general del trabajo
      estado: {
        type: DataTypes.ENUM("activo", "pausado", "finalizado"),
        defaultValue: "activo",
        allowNull: false,
      },

      // ✅ Estado final (SOLO cuando se finaliza)
      estadoFinal: {
        type: DataTypes.ENUM("exitoso", "malo"),
        allowNull: true, // ← AQUÍ se maneja el NULL
      },
    },
    {
      tableName: "trabajos",
      timestamps: true,
    }
  );

  Trabajo.associate = (models) => {
    // Aquí puedes agregar relaciones después si quieres
  };

  return Trabajo;
};
