const express = require("express");
const router = express.Router();

const trabajoController = require("../controllers/trabajoController");

// ===========================================================
// 🔹 Crear trabajo (empleador crea oferta)
// ===========================================================
router.post("/", trabajoController.crear);

// ===========================================================
// 🔹 Listar trabajos con filtros
// ===========================================================
router.get("/", trabajoController.listar);

// ===========================================================
// 🔹 Listar trabajos del EMPLEADOR
// ===========================================================

// ⚠️ VALIDAMOS QUE LA FUNCIÓN EXISTA
if (typeof trabajoController.listarPorEmpleador === "function") {
  router.get("/mios/:empleadorId", trabajoController.listarPorEmpleador);
} else {
  console.error("❌ ERROR: listarPorEmpleador NO está definido en trabajoController.js");
}

// ===========================================================
// 🔹 Obtener trabajo por ID
// ===========================================================
router.get("/:id", trabajoController.obtenerUno);

// ===========================================================
// 🔹 Actualizar trabajo
// ===========================================================
router.put("/:id", trabajoController.actualizar);

// ===========================================================
// 🔹 Cambiar estado (activo/pausado/finalizado)
// ===========================================================
router.patch("/:id/estado", trabajoController.cambiarEstado);

// ===========================================================
// 🔹 Eliminar trabajo
// ===========================================================
router.delete("/:id", trabajoController.eliminar);

module.exports = router;
