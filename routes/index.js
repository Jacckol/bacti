'use strict';

const express = require('express');
const router = express.Router();

// ==========================================================
// 🔹 Legacy system (aún utilizado)
// ==========================================================
const action = require('../methods/actions');

// ==========================================================
// 🔹 RUTAS SERVX (MODERNAS)
// ==========================================================
const userRoutes = require('./user.routes');
const trabajadorRoutes = require('./trabajador.routes');
const perfilLaboralRoutes = require('./perfilLaboral.routes');
const perfilRoutes = require('./perfil.routes');
const servicioRoutes = require('./servicio.routes');

// ==========================================================
// 🔹 RUTA DE BILLETERA
// ==========================================================
const transactionRoutes = require('./transaction.routes');

// ==========================================================
// 🔹 RUTAS MÓDULO EMPLEADOR
// ==========================================================
const empleadorRoutes = require('../empleador/routes/empleador.routes');
const perfilEmpleadorRoutes = require('../empleador/routes/perfilEmpleadorRoutes');
const trabajoRoutes = require('../empleador/routes/trabajo.routes');
const postulacionRoutes = require('../empleador/routes/postulacion.routes');

// ==========================================================
// 🔹 RUTAS DE NOTIFICACIONES (UNIFICADAS)
// ==========================================================
// ⚠️ YA NO USAMOS rutas de empleador/notificaciones
const notificacionRoutes = require('../routes/notificacion.routes');

// ==========================================================
// 🔹 RUTAS SERVX
// ==========================================================
router.use('/api', userRoutes);
router.use('/api/trabajadores', trabajadorRoutes);
router.use('/api/perfil-laboral', perfilLaboralRoutes);
router.use('/api/perfil', perfilRoutes);
router.use('/api/servicios', servicioRoutes);

// ==========================================================
// 🔹 RUTAS EMPLEADOR
// ==========================================================
router.use('/api/empleadores', empleadorRoutes);
router.use('/api/perfil-empleador', perfilEmpleadorRoutes);
router.use('/api/trabajos', trabajoRoutes);
router.use('/api/postulaciones', postulacionRoutes);

// ==========================================================
// 🔹 RUTAS DE NOTIFICACIONES (UNIFICADAS)
// ==========================================================
router.use('/api/notificaciones', notificacionRoutes);

// ==========================================================
// 🔹 RUTA DE BILLETERA
// ==========================================================
router.use('/api/transactions', transactionRoutes);

// ==========================================================
// 🔹 LEGACY ROUTES (AÚN NECESARIAS PARA APP VIEJA)
// ==========================================================
router.post('/api/register', action.addNew);
router.post('/api/login', action.authenticate);
router.get('/api/getinfo', action.getinfo);

router.post('/api/addpost', action.addPost);
router.get('/api/getallpost', action.getAllPost);
router.get('/api/getpostbyid/:id', action.getPostbyId);
router.get('/api/getpostbyauthorid/:id', action.getPostbyAuthorId);
router.get('/api/searchpost/:title', action.searchPost);
router.put('/api/updatepost/:id', action.updatePost);
router.delete('/api/deletepost/:id', action.deletePost);

// ==========================================================
// 🔹 TEST
// ==========================================================
router.get('/', (req, res) => res.send('THIS IS HOME'));
router.get('/dashboard', (req, res) => res.send('THIS IS DASHBOARD'));

module.exports = router;
