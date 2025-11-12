'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      rol: {
        type: DataTypes.ENUM('cliente', 'empleador'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users', // nombre exacto de la tabla
      timestamps: true,   // crea createdAt y updatedAt
    }
  );

  return User;
};
