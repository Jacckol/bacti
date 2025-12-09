const express = require("express");
const router = express.Router();

const notificacionController = require("../controllers/notificacion.controller");

// Obtener las notificaciones de un usuario (empleador o trabajador)
// GET /api/notificaciones/:userId
router.get("/:userId", notificacionController.getNotificacionesUsuario);

// Marcar notificación como leída
// PATCH /api/notificaciones/:id/leer
router.patch("/:id/leer", notificacionController.marcarNotificacionLeida);

module.exports = router;
