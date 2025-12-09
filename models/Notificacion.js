"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notificacion extends Model {
    static associate(models) {
      // Relación con usuario que recibe la notificación
      Notificacion.belongsTo(models.User, {
        foreignKey: "userId",
        as: "usuario",
      });
    }
  }

  Notificacion.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mensaje: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      leido: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Notificacion",
      tableName: "notificaciones",
    }
  );

  return Notificacion;
};
