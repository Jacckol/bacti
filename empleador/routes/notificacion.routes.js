const express = require("express");
const router = express.Router();

// 👇 IMPORTACIÓN CORRECTA (USA EL NOMBRE REAL DEL ARCHIVO)
const notificacionController = require("../controllers/notificacionController");

// Crear notificación
router.post("/", notificacionController.crear);

// Listar por usuario
router.get("/:userId", notificacionController.listarPorUsuario);

// Marcar como leída
router.put("/:id/leido", notificacionController.marcarLeido);

module.exports = router;
