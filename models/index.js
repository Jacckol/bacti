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
// 🔹 Objeto principal db
// ==========================================================
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ==========================================================
// 🔹 Importar modelos
// ==========================================================
db.User        = require('./User')(sequelize, Sequelize.DataTypes);
db.Trabajador  = require('./trabajador')(sequelize, Sequelize.DataTypes);  //
db.PerfilLaboral = require('./perfilLaboral')(sequelize, Sequelize.DataTypes);
db.Perfil      = require('./Perfil')(sequelize, Sequelize.DataTypes);
db.Servicio    = require('./Servicio')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 Asociaciones claras y correctas
// ==========================================================

// 1️⃣ Usuario → Servicios (1:N)
db.User.hasMany(db.Servicio, {
  foreignKey: 'userId',
  as: 'servicios',
  onDelete: 'CASCADE',
});

db.Servicio.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'autorServicio',
});

// 2️⃣ Usuario → Trabajador (1:1)
db.User.hasOne(db.Trabajador, {
  foreignKey: 'userId',
  as: 'trabajador',
  onDelete: 'CASCADE',
});

db.Trabajador.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'dueño',
});

// 3️⃣ Usuario → Perfil Laboral antiguo (1:1)
db.User.hasOne(db.PerfilLaboral, {
  foreignKey: 'userId',
  as: 'perfilLaboral',
  onDelete: 'CASCADE',
});

db.PerfilLaboral.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'usuarioPerfilLaboral',
});

// 4️⃣ Usuario → Perfil Profesional nuevo (1:1)
db.User.hasOne(db.Perfil, {
  foreignKey: 'userId',
  as: 'perfil',
  onDelete: 'CASCADE',
});

db.Perfil.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'usuarioPerfil',
});

// ==========================================================
// 🔹 Ejecutar associate() si algún modelo lo implementa
// ==========================================================
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ==========================================================
// 🔹 Exportar db
// ==========================================================
module.exports = db;
