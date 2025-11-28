"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class PerfilEmpleador extends Model {
    static associate(models) {
      // 🔹 Un perfil pertenece a un Empleador
      PerfilEmpleador.belongsTo(models.Empleador, {
        foreignKey: "empleadorId",
        as: "empleadorInfo",
        onDelete: "CASCADE",
      });
    }
  }

  PerfilEmpleador.init(
    {
      empleadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "empleadores",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      ubicacion: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      categoria: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      experiencia: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      habilidades: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },

      fotoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      cvUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PerfilEmpleador",
      tableName: "perfiles_empleadores",
      timestamps: true,
    }
  );

  return PerfilEmpleador;
};
