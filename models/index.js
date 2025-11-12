'use strict';
require('dotenv').config();
const Sequelize = require('sequelize');

// ==========================================================
// 🔹 Conexión con PostgreSQL
// ==========================================================
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

// ==========================================================
// 🔹 Comprobación de conexión
// ==========================================================
sequelize
  .authenticate()
  .then(() => console.log('✅ Conectado correctamente a PostgreSQL'))
  .catch((err) => console.error('❌ Error al conectar a PostgreSQL:', err));

// ==========================================================
// 🔹 Importar modelos
// ==========================================================
const User = require('./user')(sequelize, Sequelize.DataTypes);
const Empleador = require('./empleador')(sequelize, Sequelize.DataTypes);
const Trabajo = require('./trabajo')(sequelize, Sequelize.DataTypes);
const PerfilEmpleador = require('./perfilEmpleador')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 Asociaciones entre modelos
// ==========================================================

// 🧍 Un usuario tiene un empleador
User.hasOne(Empleador, {
  foreignKey: 'userId',
  as: 'empleador', // alias único
  onDelete: 'CASCADE',
});

// 👔 Un empleador pertenece a un usuario
Empleador.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user', // alias único
});

// 💼 Un empleador tiene muchos trabajos
Empleador.hasMany(Trabajo, {
  foreignKey: 'empleadorId',
  as: 'trabajos', // alias único
  onDelete: 'CASCADE',
});

// 🔧 Un trabajo pertenece a un empleador
Trabajo.belongsTo(Empleador, {
  foreignKey: 'empleadorId',
  as: 'empleadorTrabajo', // 🔹 alias único
});

// 🧩 Un empleador tiene un perfil
Empleador.hasOne(PerfilEmpleador, {
  foreignKey: 'empleadorId',
  as: 'perfil', // 🔹 alias único
  onDelete: 'CASCADE',
});

// 🧩 Un perfil pertenece a un empleador
PerfilEmpleador.belongsTo(Empleador, {
  foreignKey: 'empleadorId',
  as: 'empleadorPerfil', // 🔹 alias único
});

// ==========================================================
// 🔹 Registrar modelos en el objeto db
// ==========================================================
const db = {
  sequelize,
  Sequelize,
  User,
  Empleador,
  Trabajo,
  PerfilEmpleador,
};

// ==========================================================
// 🔹 Ejecutar asociaciones automáticas si los modelos las definen
// ==========================================================
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ==========================================================
// 🔹 Exportar el objeto db
// ==========================================================
module.exports = db;
