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
// 🔹 Importar MODELOS (SERVX ORIGINAL)
// ==========================================================
db.User           = require('./User')(sequelize, Sequelize.DataTypes);
db.Trabajador     = require('./trabajador')(sequelize, Sequelize.DataTypes);
db.PerfilLaboral  = require('./perfilLaboral')(sequelize, Sequelize.DataTypes);
db.Perfil         = require('./Perfil')(sequelize, Sequelize.DataTypes);
db.Servicio       = require('./Servicio')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 Importar MODELOS (EMPLEADOR)
// ==========================================================
db.Empleador        = require('../empleador/models/empleador')(sequelize, Sequelize.DataTypes);
db.Trabajo          = require('../empleador/models/trabajo')(sequelize, Sequelize.DataTypes);
db.PerfilEmpleador  = require('../empleador/models/perfilEmpleador')(sequelize, Sequelize.DataTypes);
db.Postulacion      = require('../empleador/models/postulacion')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 Importar MODELO Solicitud del Trabajador
// ==========================================================
db.SolicitudTrabajo = require('./SolicitudTrabajo')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 IMPORTAR MODELO DE TRANSACCIONES (billetera)
// ==========================================================
db.Transaction = require('./transaction')(sequelize, Sequelize.DataTypes);

// ==========================================================
// 🔹 ASOCIACIONES (SERVX)
// ==========================================================

// Usuario → Servicios (1:N)
db.User.hasMany(db.Servicio, {
  foreignKey: 'userId',
  as: 'servicios',
  onDelete: 'CASCADE',
});
db.Servicio.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'autorServicio',
});

// Usuario → Trabajador (1:1)
db.User.hasOne(db.Trabajador, {
  foreignKey: 'userId',
  as: 'trabajador',
  onDelete: 'CASCADE',
});
db.Trabajador.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'dueño',
});

// Usuario → Perfil Laboral (1:1)
db.User.hasOne(db.PerfilLaboral, {
  foreignKey: 'userId',
  as: 'perfilLaboral',
  onDelete: 'CASCADE',
});
db.PerfilLaboral.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'usuarioPerfilLaboral',
});

// Usuario → Perfil Profesional (1:1)
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
// 🔹 ASOCIACIONES (EMPLEADOR)
// ==========================================================

// Usuario → Empleador (1:1)
db.User.hasOne(db.Empleador, {
  foreignKey: 'userId',
  as: 'empleador',
  onDelete: 'CASCADE',
});
db.Empleador.belongsTo(db.User, {
  foreignKey: 'userId',
  as: 'usuarioEmpleador',
});

// Empleador → Trabajo (1:N)
db.Empleador.hasMany(db.Trabajo, {
  foreignKey: 'empleadorId',
  as: 'trabajos',
  onDelete: 'CASCADE',
});

// Trabajo → Empleador
db.Trabajo.belongsTo(db.Empleador, {
  foreignKey: 'empleadorId',
  as: 'empleador',
});

// Empleador → Perfil Empleador (1:1)
db.Empleador.hasOne(db.PerfilEmpleador, {
  foreignKey: 'empleadorId',
  as: 'perfilEmpleador',
  onDelete: 'CASCADE',
});
db.PerfilEmpleador.belongsTo(db.Empleador, {
  foreignKey: 'empleadorId',
  as: 'usuarioDelPerfil',
});

// ==========================================================
// 🔹 ASOCIACIONES (SOLICITUDES DEL TRABAJADOR)
// ==========================================================

// Usuario (Trabajador) → Solicitudes (1:N)
db.User.hasMany(db.SolicitudTrabajo, {
  foreignKey: "userId",
  as: "solicitudes",
  onDelete: "CASCADE",
});

// Trabajo → Solicitudes (1:N)
db.Trabajo.hasMany(db.SolicitudTrabajo, {
  foreignKey: "trabajoId",
  as: "solicitudesDeTrabajo",
  onDelete: "CASCADE",
});
db.SolicitudTrabajo.belongsTo(db.Trabajo, {
  foreignKey: "trabajoId",
  as: "trabajoDelSolicitante",
});

// ==========================================================
// 🔹 ASOCIACIONES (BILLETERA) — funcionando 100%
// ==========================================================

// Usuario → Transacciones (1:N)
db.User.hasMany(db.Transaction, {
  foreignKey: "userId",
  as: "transacciones",
  onDelete: "CASCADE",
});

// Transacción → Usuario (N:1)
db.Transaction.belongsTo(db.User, {
  foreignKey: "userId",
  as: "usuarioTransaccion",
});

// ==========================================================
// 🔹 Ejecutar associate() si existe
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
