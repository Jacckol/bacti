'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PerfilLaboral extends Model {
    /**
     * Define relaciones con otros modelos
     */
    static associate(models) {
      // 🔹 Un perfil laboral pertenece a un empleador
      PerfilLaboral.belongsTo(models.Empleador, {
        foreignKey: 'empleadorId',
        as: 'empleador',
        onDelete: 'CASCADE',
      });
    }
  }

  PerfilLaboral.init(
    {
      // 🔹 ID del empleador (asignado automáticamente desde JWT)
      empleadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'empleadores',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      nombreCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      cedulaRuc: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      telefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      nombreComercial: {
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

      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      horario: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      experiencia: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'PerfilLaboral',
      tableName: 'perfiles_laborales',
      timestamps: true,
    }
  );

  return PerfilLaboral;
};
