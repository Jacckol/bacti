'use strict';
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const passport = require('passport');
const path = require('path');
require('dotenv').config();

// 🔹 Routers
const routes = require('./routes/index'); // rutas principales (usuarios, posts, etc.)
const perfilEmpleadorRoutes = require('./routes/perfilEmpleadorRoutes'); // perfil de empleador

// 🔹 Sequelize
const { sequelize } = require('./models');

const app = express();

// ==========================================================
// 🔹 Middlewares globales
// ==========================================================
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

// ✅ Servir archivos subidos (fotos y CVs)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================================
// 🔹 Passport JWT
// ==========================================================
app.use(passport.initialize());
require('./config/passport')(passport); // config de JWT

// ==========================================================
// 🔹 Rutas
// ==========================================================
app.use(routes); // rutas principales
app.use('/api/perfil-empleador', perfilEmpleadorRoutes); // perfil empleador

// ==========================================================
// 🔹 Sincronizar modelos con la base de datos
// ==========================================================
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Tablas sincronizadas'))
  .catch(err => console.error('❌ Error sincronizando tablas:', err));

// ==========================================================
// 🔹 Conectar PostgreSQL
// ==========================================================
sequelize.authenticate()
  .then(() => console.log('✅ Conectado correctamente a PostgreSQL'))
  .catch(err => console.error('❌ Error al conectar a PostgreSQL:', err));

// ==========================================================
// 🔹 Iniciar Servidor
// ==========================================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
