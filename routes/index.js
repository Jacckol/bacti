'use strict';
const express = require('express');
const router = express.Router();
const action = require('../methods/actions'); // Métodos legacy

// ===========================================================
// 🔹 IMPORTAR RUTAS EXTERNAS
// ===========================================================

// Rutas de usuario (registro, login, info)
const userRoutes = require('./user.routes');
router.use('/api', userRoutes); // → /api/register, /api/login, etc.

// Rutas de empleador
const empleadorRoutes = require('./empleador.routes');
router.use('/api/empleadores', empleadorRoutes); // → /api/empleadores/*

// Rutas de trabajos
const trabajoRoutes = require('./trabajo.routes');
router.use('/api/trabajos', trabajoRoutes); // → /api/trabajos/publicar, etc.

// Rutas de perfil de empleador
const perfilEmpleadorRoutes = require('./perfilEmpleadorRoutes'); // ← archivo perfilEmpleadorRoutes.js
router.use('/api/perfil-empleador', perfilEmpleadorRoutes); // → /api/perfil-empleador/:empleadorId

// ===========================================================
// 🔹 RUTAS DE PRUEBA
// ===========================================================
router.get('/', (req, res) => res.send('THIS IS HOME'));
router.get('/dashboard', (req, res) => res.send('THIS IS DASHBOARD'));

// ===========================================================
// 🔹 MÉTODOS DE ACCIÓN (LEGADO DE actions.js)
// ===========================================================

// Registro de usuario
router.post('/api/register', action.addNew);

// Login de usuario
router.post('/api/login', action.authenticate);

// Obtener información del usuario autenticado
router.get('/api/getinfo', action.getinfo);

// ===========================================================
// 🔹 MÉTODOS PARA PUBLICACIONES (POSTS)
// ===========================================================

// Crear nuevo post
router.post('/api/addpost', action.addPost);

// Obtener todos los posts
router.get('/api/getallpost', action.getAllPost);

// Obtener post por ID
router.get('/api/getpostbyid/:id', action.getPostbyId);

// Obtener posts por autor
router.get('/api/getpostbyauthorid/:id', action.getPostbyAuthorId);

// Buscar posts por título
router.get('/api/searchpost/:title', action.searchPost);

// Actualizar un post
router.put('/api/updatepost/:id', action.updatePost);

// Eliminar un post
router.delete('/api/deletepost/:id', action.deletePost);

// ===========================================================
// 🔹 EXPORTAR ROUTER PRINCIPAL
// ===========================================================
module.exports = router;
