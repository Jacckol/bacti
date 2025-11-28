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

      // 🔹 ID del EMPLEADOR (no del User)
      empleadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "empleadores",
          key: "id",
        },
        onDelete: "CASCADE",
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

  // ======================================================
  // 🔹 ASOCIACIONES
  // ======================================================
  Trabajo.associate = (models) => {
    // Un trabajo pertenece a un empleador
    Trabajo.belongsTo(models.Empleador, {
      foreignKey: "empleadorId",
      as: "autor",
    });
  };

  return Trabajo;
};
