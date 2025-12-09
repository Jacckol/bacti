const express = require("express");
const router = express.Router();

const notificacionController = require("../controllers/notificacionController");

// Crear notificación manual (opcional)
router.post("/", notificacionController.crearNotificacionManual);

// Obtener notificaciones por usuario
router.get("/:userId", notificacionController.getNotificacionesUsuario);

// Marcar como leída
router.put("/:id/leido", notificacionController.marcarNotificacionLeida);

module.exports = router;
