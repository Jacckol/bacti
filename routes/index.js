'use strict';

const express = require('express');
const router = express.Router();

// ===========================================================
// 🔹 IMPORTAR MÉTODOS LEGACY (sistema viejo)
// ===========================================================
const action = require('../methods/actions');

// ===========================================================
// 🔹 IMPORTAR RUTAS MODERNAS (SERVX NUEVO)
// ===========================================================
const userRoutes = require('./user.routes');
const trabajadorRoutes = require('./trabajador.routes'); // 🔥 AHORA SÍ
const perfilLaboralRoutes = require('./perfilLaboral.routes');
const perfilRoutes = require('./perfil.routes');
const servicioRoutes = require('./servicio.routes');

// ===========================================================
// 🔹 RUTAS MODERNAS (SERVX NEW SYSTEM)
// ===========================================================

// 🟦 Usuarios (registro, login, datos)
router.use('/api', userRoutes);

// 🟩 Trabajadores 
router.use('/api/trabajadores', trabajadorRoutes);

// 🟨 Perfil laboral (viejo)
router.use('/api/perfil-laboral', perfilLaboralRoutes);

// 🟪 Perfil profesional moderno (nuevo)
router.use('/api/perfil', perfilRoutes);

// 🟧 Servicios — publicar, listar, editar, eliminar
router.use('/api/servicios', servicioRoutes);

// ===========================================================
// 🔹 RUTAS DE PRUEBA
// ===========================================================
router.get('/', (req, res) => res.send('THIS IS HOME'));
router.get('/dashboard', (req, res) => res.send('THIS IS DASHBOARD'));

// ===========================================================
// 🔹 RUTAS LEGACY (sistema antiguo)
// ===========================================================

// 🟦 Auth legacy
router.post('/api/register', action.addNew);
router.post('/api/login', action.authenticate);
router.get('/api/getinfo', action.getinfo);

// 🟨 Posts legacy
router.post('/api/addpost', action.addPost);
router.get('/api/getallpost', action.getAllPost);
router.get('/api/getpostbyid/:id', action.getPostbyId);
router.get('/api/getpostbyauthorid/:id', action.getPostbyAuthorId);
router.get('/api/searchpost/:title', action.searchPost);
router.put('/api/updatepost/:id', action.updatePost);
router.delete('/api/deletepost/:id', action.deletePost);

// ===========================================================
// 🔹 EXPORTAR ROUTER
// ===========================================================
module.exports = router;
