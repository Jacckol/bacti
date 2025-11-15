'use strict';

const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilLaboral.controller');
const authMiddleware = require('../middlewares/auth'); // token obligatorio

// Crear perfil laboral
router.post('/', authMiddleware, perfilController.crearPerfilLaboral);

// Verificar si ya tiene perfil (USADO POR FLUTTER)
router.get('/mine', authMiddleware, perfilController.verificarPerfilExistente);

// Obtener mi perfil
router.get('/', authMiddleware, perfilController.obtenerPerfilDelEmpleador);

// Actualizar perfil
router.put('/', authMiddleware, perfilController.actualizarPerfilLaboral);

// Obtener todos los perfiles
router.get('/todos', perfilController.obtenerTodosPerfilesLaborales);

module.exports = router;
