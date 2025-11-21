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
// 🔹 Importar modelos (cada uno en su archivo separado)
// ==========================================================
db.User          = require('./User')(sequelize, Sequelize.DataTypes);
db.Trabajo       = require('./Trabajo')(sequelize, Sequelize.DataTypes);
db.Empleador     = require('./Empleador')(sequelize, Sequelize.DataTypes);
db.PerfilLaboral = require('./perfilLaboral')(sequelize, Sequelize.DataTypes);
db.Perfil        = require('./Perfil')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 Asociaciones — SOLO AQUÍ, Y SIN DUPLICADOS
// ==========================================================

// 1️⃣ Un usuario puede tener muchos trabajos
db.User.hasMany(db.Trabajo, {
  foreignKey: 'userId',
  as: 'trabajos',
  onDelete: 'CASCADE',
});
db.Trabajo.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'autor',         // 👈 CAMBIADO para no duplicar “usuario”
});

// 2️⃣ Un usuario tiene un empleador
db.User.hasOne(db.Empleador, {
  foreignKey: 'userId',
  as: 'empleador',
  onDelete: 'CASCADE',
});
db.Empleador.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'dueño',         // 👈 CAMBIADO para evitar conflicto
});

// 3️⃣ Perfil laboral antiguo (si lo sigues usando)
db.User.hasOne(db.PerfilLaboral, {
  foreignKey: 'userId',
  as: 'perfilLaboral',
  onDelete: 'CASCADE',
});
db.PerfilLaboral.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'usuarioPerfilLaboral',   // 👈 alias único
});

// 4️⃣ TU PERFIL NUEVO (tabla `perfil`)
db.User.hasOne(db.Perfil, {
  foreignKey: 'userId',
  as: 'perfil',
  onDelete: 'CASCADE',
});
db.Perfil.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'usuarioPerfil',          // 👈 alias único
});

// ==========================================================
// 🔹 Ejecutar associate() si algún modelo lo trae
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
