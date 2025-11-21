'use strict';

const express = require('express');
const router = express.Router();

// ===========================================================
// 🔹 IMPORTAR MÉTODOS LEGACY (actions.js) – sistema viejo
// ===========================================================
const action = require('../methods/actions');

// ===========================================================
// 🔹 IMPORTAR RUTAS MODERNAS (NUEVAS APIs DE SERVX)
// ===========================================================
const userRoutes = require('./user.routes');
const empleadorRoutes = require('./empleador.routes');
const perfilLaboralRoutes = require('./perfilLaboral.routes');
const trabajoRoutes = require('./trabajo.routes');
const perfilRoutes = require('./perfil.routes');   // 🔥 Tu nuevo PERFIL PROFESIONAL

// ===========================================================
// 🔹 RUTAS BASE DEL BACKEND
// ===========================================================

// 🟦 USUARIOS – registro, login, info
router.use('/api', userRoutes); 

// 🟩 EMPLEADORES – registro, login empleador y perfil empresa
router.use('/api/empleadores', empleadorRoutes);

// 🟨 PERFIL LABORAL – formulario inicial (simple)
router.use('/api/perfil-laboral', perfilLaboralRoutes);

// 🟪 PERFIL PROFESIONAL – módulo completo (foto, CV, habilidades, todo)
router.use('/api/perfil', perfilRoutes); 
// 👉 Endpoints disponibles:
// GET  /api/perfil/mine         (obtener perfil)
// POST /api/perfil              (crear perfil)
// PUT  /api/perfil              (actualizar datos)
// POST /api/perfil/upload-foto  (subir foto)
// POST /api/perfil/upload-cv    (subir CV)

// 🟧 TRABAJOS – publicar trabajos, listar, ver, etc.
router.use('/api/trabajos', trabajoRoutes);

// ===========================================================
// 🔹 PRUEBAS SIMPLES
// ===========================================================
router.get('/', (req, res) => res.send('THIS IS HOME'));
router.get('/dashboard', (req, res) => res.send('THIS IS DASHBOARD'));

// ===========================================================
// 🔹 RUTAS LEGACY (Sistema Viejo de actions.js)
// ===========================================================

// 🟦 Auth viejo
router.post('/api/register', action.addNew);
router.post('/api/login', action.authenticate);
router.get('/api/getinfo', action.getinfo);

// 🟨 Posts viejo
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
