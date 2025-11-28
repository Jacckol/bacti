const express = require('express');
const router = express.Router();

const upload = require("../middlewares/uploadEmployer");
const empleadorController = require("../controllers/empleadorController");

// ===============================================================
// 🔹 GET /api/empleadores  -> Lista todos los empleadores
// ===============================================================
router.get('/', empleadorController.getAll);

// ===============================================================
// 🔹 GET /api/empleadores/:userId  -> Obtiene un empleador por userId
// ===============================================================
router.get('/:userId', empleadorController.obtener);

// ===============================================================
// 🔹 POST /api/empleadores  -> Registrar empleador con foto
// ===============================================================
router.post(
  '/',
  upload.single("foto"),
  empleadorController.registrar
);

// ===============================================================
// 🔹 DELETE /api/empleadores/:id -> Eliminar empleador
// ===============================================================
router.delete('/:id', empleadorController.eliminar);

module.exports = router;
