"use strict";

const express = require("express");
const router = express.Router();
const multer = require("multer");

// Import correcto del controller
const perfilEmpleadorController = require("../controllers/perfilEmpleadorController");

// Multer: archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

/* ============================================================
   🔹 Obtener nombre del empleador por userId
=============================================================== */
router.get("/nombre/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId) || userId <= 0)
      return res.status(400).json({ message: "ID de usuario inválido" });

    const { Empleador, User } = require("../../models");

    const empleador = await Empleador.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["nombre"],
          as: "usuario"
        },
      ],
    });

    if (!empleador)
      return res.status(404).json({ message: "Empleador no encontrado" });

    res.json({
      empleadorId: empleador.id,
      nombre: empleador.usuario?.nombre || "Sin nombre",
    });

  } catch (error) {
    console.error("❌ Error:", error);
    res.status(500).json({
      message: "Error interno",
      error: error.message,
    });
  }
});

/* ============================================================
   🔹 Crear perfil del empleador
=============================================================== */
router.post(
  "/",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  perfilEmpleadorController.crearPerfil   // ← CORREGIDO
);

/* ============================================================
   🔹 Actualizar perfil del empleador
=============================================================== */
router.put(
  "/:empleadorId",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  perfilEmpleadorController.actualizarPerfil  // ← CORREGIDO
);

module.exports = router;
