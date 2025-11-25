const express = require("express");
const router = express.Router();
const servicioCtrl = require("../controllers/servicio.controller");

// Crear
router.post("/", servicioCtrl.crear);

// Listar
router.get("/", servicioCtrl.listar);

// Editar
router.put("/:id", servicioCtrl.editar);

// Eliminar
router.delete("/:id", servicioCtrl.eliminar);

module.exports = router;
