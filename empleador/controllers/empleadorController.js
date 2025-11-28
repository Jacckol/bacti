'use strict';

const { Empleador } = require('../../models');

// ==========================================================
// 🔹 LISTAR TODOS LOS EMPLEADORES
//    GET /api/empleadores
// ==========================================================
exports.getAll = async (req, res) => {
  try {
    const data = await Empleador.findAll();
    return res.json({ empleadores: data });
  } catch (e) {
    console.error('❌ Error al listar empleadores:', e);
    return res.status(500).json({ error: "Error al listar empleadores" });
  }
};

// ==========================================================
// 🔹 OBTENER EMPLEADOR POR userId
//    GET /api/empleadores/:userId
// ==========================================================
exports.obtener = async (req, res) => {
  try {
    const empleador = await Empleador.findOne({
      where: { userId: req.params.userId }
    });

    if (!empleador) {
      return res.status(404).json({ error: "No encontrado" });
    }

    return res.json({ empleador });
  } catch (e) {
    console.error('❌ Error al obtener empleador:', e);
    return res.status(500).json({ error: "Error al obtener empleador" });
  }
};

// ==========================================================
// 🔹 REGISTRAR EMPLEADOR (solo DATOS + FOTO)
//    POST /api/empleadores
// ==========================================================
exports.registrar = async (req, res) => {
  try {
    const { userId, empresa, ruc, responsable, telefono, direccion } = req.body;

    // VALIDACIÓN
    if (!userId || !empresa || !ruc || !responsable || !telefono || !direccion) {
      return res.status(400).json({
        error: "Faltan campos obligatorios en el body"
      });
    }

    // FOTO (si viene)
    const foto_url = req.file
      ? `/uploads/empleadores/${req.file.filename}`
      : null;

    // CREAR EMPLEADOR
    const nuevo = await Empleador.create({
      userId,
      empresa,
      ruc,
      responsable,
      telefono,
      direccion,
      foto_url
    });

    return res.status(201).json({
      message: "Empleador registrado correctamente",
      empleador: nuevo
    });

  } catch (e) {
    console.error('❌ Error al registrar empleador:', e);
    return res.status(500).json({ error: "Error al registrar empleador" });
  }
};

// ==========================================================
// 🔹 ELIMINAR EMPLEADOR
//    DELETE /api/empleadores/:id
// ==========================================================
exports.eliminar = async (req, res) => {
  try {
    const empleador = await Empleador.findByPk(req.params.id);

    if (!empleador) {
      return res.status(404).json({ error: "No encontrado" });
    }

    await empleador.destroy();

    return res.json({ message: "Eliminado correctamente" });

  } catch (e) {
    console.error('❌ Error al eliminar empleador:', e);
    return res.status(500).json({ error: "Error al eliminar" });
  }
};
