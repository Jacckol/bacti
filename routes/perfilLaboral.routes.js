'use strict';

const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilLaboral.controller');
const authMiddleware = require('../middlewares/auth'); // token obligatorio

// ===============================================================
// 🔹 CREAR perfil laboral (TRABAJADOR)
// ===============================================================
router.post('/', authMiddleware, perfilController.crearPerfilLaboral);

// ===============================================================
// 🔹 Verificar si ya tiene perfil (USADO POR FLUTTER)
// ===============================================================
router.get('/mine', authMiddleware, perfilController.verificarPerfilExistente);

// ===============================================================
// 🔹 Obtener MI perfil laboral (del trabajador autenticado)
// ===============================================================
router.get('/', authMiddleware, perfilController.obtenerPerfilDelTrabajador);

// ===============================================================
// 🔹 Actualizar perfil laboral
// ===============================================================
router.put('/', authMiddleware, perfilController.actualizarPerfilLaboral);

// ===============================================================
// 🔹 Obtener TODOS los perfiles laborales de trabajadores
// ===============================================================
router.get('/todos', perfilController.obtenerTodosPerfilesLaborales);

module.exports = router;
