'use strict';
const express = require('express');
const router = express.Router();
const perfilLaboralController = require('../controllers/perfilLaboral.controller');

// 🔹 Crear un perfil laboral (sin token)
router.post('/', perfilLaboralController.crearPerfilLaboral);

// 🔹 Obtener perfil laboral por default (sin token)
router.get('/', perfilLaboralController.obtenerPerfilDelEmpleador);

// 🔹 Actualizar perfil laboral por default (sin token)
router.put('/', perfilLaboralController.actualizarPerfilLaboral);

// 🔹 Obtener todos los perfiles laborales (sin token)
router.get('/todos', perfilLaboralController.obtenerTodosPerfilesLaborales);

module.exports = router;
