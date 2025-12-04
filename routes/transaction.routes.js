const express = require("express");
const router = express.Router();

const controller = require("../controllers/transaction.controller");
const auth = require("../middlewares/auth");  // tu middleware existente

// Crear transacción
router.post("/", auth, controller.crear);

// Obtener mis transacciones
router.get("/mine", auth, controller.misTransacciones);

// (Opcional admin)
router.get("/all", controller.todas);

module.exports = router;
