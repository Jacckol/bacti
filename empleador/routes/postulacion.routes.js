"use strict";

const express = require("express");
const router = express.Router();

const postulacionController = require("../controllers/postulacionController");

// ======================================================
// 🔹 Crear postulación
// ======================================================
router.post("/", postulacionController.crear);

// ======================================================
// 🔹 Listar postulaciones de un trabajo
// ======================================================
router.get("/trabajo/:trabajoId", postulacionController.porTrabajo);

// ======================================================
// 🔥 NUEVO: Listar postulaciones de un usuario (TRABAJADOR)
// ======================================================
router.get("/usuario/:userId", postulacionController.porUsuario);

// ======================================================
// 🔹 Cambiar estado (pendiente / aceptado / rechazado)
// ======================================================
router.patch("/:id/estado", postulacionController.cambiarEstado);

module.exports = router;
