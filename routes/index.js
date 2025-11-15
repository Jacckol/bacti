'use strict';
const express = require('express');
const router = express.Router();

// ===========================================================
// 🔹 IMPORTAR MÉTODOS LEGACY (actions.js)
// ===========================================================
const action = require('../methods/actions');

// ===========================================================
// 🔹 IMPORTAR RUTAS MODERNAS
// ===========================================================
const userRoutes = require('./user.routes');
const empleadorRoutes = require('./empleador.routes');
const perfilLaboralRoutes = require('./perfilLaboral.routes');
const trabajoRoutes = require('./trabajo.routes');

// ===========================================================
// 🔹 RUTAS BASE DEL API
// ===========================================================

// 🟦 Usuarios – register / login / getinfo
router.use('/api', userRoutes);  
// → POST /api/register, POST /api/login, GET /api/users ...

// 🟩 Empleador – CRUD empleador
router.use('/api/empleadores', empleadorRoutes);
// → POST /api/empleadores, GET /api/empleadores/:id ...

// 🟨 Perfil Laboral – formulario de primera vez
router.use('/api/perfil-laboral', perfilLaboralRoutes);
// → POST /api/perfil-laboral, GET /api/perfil-laboral, PUT ...

// 🟧 Trabajos – publicar trabajos
router.use('/api/trabajos', trabajoRoutes);
// → POST /api/trabajos/publicar, GET /api/trabajos ...

// ===========================================================
// 🔹 RUTAS DE PRUEBA
// ===========================================================
router.get('/', (req, res) => res.send('THIS IS HOME'));
router.get('/dashboard', (req, res) => res.send('THIS IS DASHBOARD'));

// ===========================================================
// 🔹 RUTAS LEGACY (actions.js) — mantener compatibilidad
// ===========================================================

// Auth legacy
router.post('/api/register', action.addNew);
router.post('/api/login', action.authenticate);
router.get('/api/getinfo', action.getinfo);

// Posts legacy
router.post('/api/addpost', action.addPost);
router.get('/api/getallpost', action.getAllPost);
router.get('/api/getpostbyid/:id', action.getPostbyId);
router.get('/api/getpostbyauthorid/:id', action.getPostbyAuthorId);
router.get('/api/searchpost/:title', action.searchPost);
router.put('/api/updatepost/:id', action.updatePost);
router.delete('/api/deletepost/:id', action.deletePost);

// ===========================================================
// 🔹 EXPORTAR ROUTER PRINCIPAL
// ===========================================================
module.exports = router;
