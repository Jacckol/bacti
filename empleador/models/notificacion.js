"use strict";

module.exports = (sequelize, DataTypes) => {
  const Notificacion = sequelize.define(
    "Notificacion",
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
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "notificaciones",
      timestamps: true,   // ✔ NECESARIO
    }
  );

  Notificacion.associate = function (models) {
    Notificacion.belongsTo(models.User, {
      foreignKey: "userId",
      as: "usuario",
    });
  };

  return Notificacion;
};
