"use strict";

const fs = require("fs");
const path = require("path");
const { PerfilEmpleador, Empleador, User } = require("../../models");

// ==========================================================
// 🔹 OBTENER NOMBRE DEL EMPLEADOR POR userId
// ==========================================================
exports.obtenerNombre = async (req, res) => {
  try {
    const { userId } = req.params;

    const empleador = await Empleador.findOne({
      where: { userId },
      include: [{ model: User, attributes: ["nombre"] }]
    });

    if (!empleador) {
      return res.status(404).json({ message: "Empleador no encontrado" });
    }

    return res.json({
      userId,
      nombre: empleador.User?.nombre || "Sin nombre"
    });

  } catch (error) {
    console.error("❌ Error al obtener nombre:", error);
    return res.status(500).json({ message: "Error interno", error: error.message });
  }
};

// ==========================================================
// 🔹 CREAR PERFIL DEL EMPLEADOR
// ==========================================================
exports.crearPerfil = async (req, res) => {
  try {
    const { empleadorId, ubicacion, categoria, experiencia, biografia, habilidades } = req.body;

    const idNum = parseInt(empleadorId, 10);
    if (isNaN(idNum) || idNum <= 0)
      return res.status(400).json({ message: "ID de empleador inválido" });

    const empleador = await Empleador.findByPk(idNum);
    if (!empleador) return res.status(404).json({ message: "El empleador no existe" });

    const existePerfil = await PerfilEmpleador.findOne({ where: { empleadorId: idNum } });
    if (existePerfil)
      return res.status(400).json({ message: "El perfil ya existe, usa PUT" });

    // Parseo de habilidades JSON
    let habilidadesArray = [];
    if (habilidades) {
      try {
        habilidadesArray = JSON.parse(habilidades);
      } catch {}
    }

    // Rutas de carpetas
    const carpetaCV = path.join(__dirname, "../../uploads/empleador/cv");
    const carpetaFoto = path.join(__dirname, "../../uploads/empleador/foto");
    fs.mkdirSync(carpetaCV, { recursive: true });
    fs.mkdirSync(carpetaFoto, { recursive: true });

    let cvUrl = null;
    let fotoUrl = null;

    if (req.files?.cv?.length > 0) {
      const cvName = `cv_${idNum}_${Date.now()}.pdf`;
      fs.writeFileSync(path.join(carpetaCV, cvName), req.files.cv[0].buffer);
      cvUrl = `/uploads/empleador/cv/${cvName}`;
    }

    if (req.files?.foto?.length > 0) {
      const fotoName = `foto_${idNum}_${Date.now()}.jpg`;
      fs.writeFileSync(path.join(carpetaFoto, fotoName), req.files.foto[0].buffer);
      fotoUrl = `/uploads/empleador/foto/${fotoName}`;
    }

    const perfil = await PerfilEmpleador.create({
      empleadorId: idNum,
      ubicacion,
      categoria,
      experiencia: experiencia ? parseInt(experiencia, 10) : 0,
      biografia,
      habilidades: habilidadesArray,
      cvUrl,
      fotoUrl,
    });

    res.status(201).json({ message: "Perfil creado correctamente", perfil });

  } catch (error) {
    console.error("❌ Error al crear perfil:", error);
    return res.status(500).json({ message: "Error al crear perfil", error: error.message });
  }
};

// ==========================================================
// 🔹 ACTUALIZAR PERFIL DEL EMPLEADOR
// ==========================================================
exports.actualizarPerfil = async (req, res) => {
  try {
    const { empleadorId } = req.params;

    const perfil = await PerfilEmpleador.findOne({ where: { empleadorId } });
    if (!perfil)
      return res.status(404).json({ message: "Perfil no encontrado" });

    // Parsear habilidades si llegan
    let habilidadesArray = perfil.habilidades;
    if (req.body.habilidades) {
      try {
        habilidadesArray = JSON.parse(req.body.habilidades);
      } catch {}
    }

    const carpetaCV = path.join(__dirname, "../../uploads/empleador/cv");
    const carpetaFoto = path.join(__dirname, "../../uploads/empleador/foto");
    fs.mkdirSync(carpetaCV, { recursive: true });
    fs.mkdirSync(carpetaFoto, { recursive: true });

    // Guardar archivos si vienen
    if (req.files?.cv?.length > 0) {
      const cvName = `cv_${empleadorId}_${Date.now()}.pdf`;
      fs.writeFileSync(path.join(carpetaCV, cvName), req.files.cv[0].buffer);
      perfil.cvUrl = `/uploads/empleador/cv/${cvName}`;
    }

    if (req.files?.foto?.length > 0) {
      const fotoName = `foto_${empleadorId}_${Date.now()}.jpg`;
      fs.writeFileSync(path.join(carpetaFoto, fotoName), req.files.foto[0].buffer);
      perfil.fotoUrl = `/uploads/empleador/foto/${fotoName}`;
    }

    // Actualizar campos
    perfil.ubicacion = req.body.ubicacion ?? perfil.ubicacion;
    perfil.categoria = req.body.categoria ?? perfil.categoria;
    perfil.experiencia = req.body.experiencia ? parseInt(req.body.experiencia, 10) : perfil.experiencia;
    perfil.biografia = req.body.biografia ?? perfil.biografia;
    perfil.habilidades = habilidadesArray;

    await perfil.save();

    res.json({ message: "Perfil actualizado correctamente", perfil });

  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    return res.status(500).json({ message: "Error al actualizar perfil", error: error.message });
  }
};
