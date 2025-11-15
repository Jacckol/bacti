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

// Probar conexión
sequelize
  .authenticate()
  .then(() => console.log('✅ Conectado correctamente a PostgreSQL'))
  .catch((err) => console.error('❌ Error al conectar a PostgreSQL:', err));

// ==========================================================
// 🔹 Crear objeto db (AQUÍ SE DEFINE ANTES DE USARLO)
// ==========================================================
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ==========================================================
// 🔹 Importar modelos
// ==========================================================
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Trabajo = require('./trabajo')(sequelize, Sequelize.DataTypes);
db.Empleador = require('./empleador')(sequelize, Sequelize.DataTypes);
db.PerfilLaboral = require('./perfilLaboral')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 Asociaciones
// ==========================================================

// 1️⃣ Un usuario tiene muchos trabajos
db.User.hasMany(db.Trabajo, {
  foreignKey: 'userId',
  as: 'trabajos',
  onDelete: 'CASCADE',
});

db.Trabajo.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'autorTrabajo',
});

// 2️⃣ Un usuario tiene un empleador (perfil básico)
db.User.hasOne(db.Empleador, {
  foreignKey: 'userId',
  as: 'empleador',
  onDelete: 'CASCADE',
});

db.Empleador.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'usuario',
});

// 3️⃣ Un usuario tiene un perfil laboral (datos extras)
db.User.hasOne(db.PerfilLaboral, {
  foreignKey: 'userId',
  as: 'perfilLaboral',
  onDelete: 'CASCADE',
});

db.PerfilLaboral.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'usuario',
});

// ==========================================================
// 🔹 Ejecutar associate() de cada modelo si existe
// ==========================================================
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// ==========================================================
// 🔹 Exportar
// ==========================================================
module.exports = db;
