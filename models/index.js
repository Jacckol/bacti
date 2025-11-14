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
const PerfilLaboral = require('./perfilLaboral')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 Asociaciones entre modelos
// ==========================================================

// 🧍 Un usuario tiene un empleador
User.hasOne(Empleador, {
  foreignKey: 'userId',
  as: 'empleador',
  onDelete: 'CASCADE',
});

// 👔 Un empleador pertenece a un usuario
Empleador.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// 💼 Un empleador tiene muchos trabajos
Empleador.hasMany(Trabajo, {
  foreignKey: 'empleadorId',
  as: 'trabajos',
  onDelete: 'CASCADE',
});

// 🔧 Un trabajo pertenece a un empleador
Trabajo.belongsTo(Empleador, {
  foreignKey: 'empleadorId',
  as: 'empleadorTrabajo',
});

// 🧩 Un empleador tiene un perfil empresarial
Empleador.hasOne(PerfilEmpleador, {
  foreignKey: 'empleadorId',
  as: 'perfil',
  onDelete: 'CASCADE',
});

// 🧩 Un perfil empresarial pertenece a un empleador
PerfilEmpleador.belongsTo(Empleador, {
  foreignKey: 'empleadorId',
  as: 'empleadorPerfil',
});

// 🧩 Un empleador tiene un perfil laboral
Empleador.hasOne(PerfilLaboral, {
  foreignKey: 'empleadorId',
  as: 'perfilLaboral',
  onDelete: 'CASCADE',
});

// 🧩 Un perfil laboral pertenece a un empleador
PerfilLaboral.belongsTo(Empleador, {
  foreignKey: 'empleadorId',
  as: 'empleadorLaboral',
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
  PerfilLaboral,
};

// ==========================================================
// 🔹 Asociaciones automáticas si existen
// ==========================================================
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ==========================================================
// 🔹 Exportar objeto db
// ==========================================================
module.exports = db;
