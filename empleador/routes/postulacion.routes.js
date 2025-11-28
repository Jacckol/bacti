"use strict";

const express = require("express");
const router = express.Router();

// 👇 IMPORTACIÓN CORRECTA (EL NOMBRE REAL DE TU ARCHIVO)
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
// 🔹 Cambiar estado (pendiente / aceptado / rechazado)
// ======================================================
router.patch("/:id/estado", postulacionController.cambiarEstado);

module.exports = router;
