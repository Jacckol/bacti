'use strict';
const fs = require('fs');
const path = require('path');
const { PerfilEmpleador, Empleador } = require('../models');
const multer = require('multer');

// Configuración de multer para guardar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// ==========================================================
// 🔹 Crear nuevo perfil del empleador (POST)
// ==========================================================
exports.crearPerfil = async (req, res) => {
  try {
    const { empleadorId, ubicacion, categoria, experiencia, biografia, habilidades } = req.body;

    const idNum = parseInt(empleadorId, 10);
    if (isNaN(idNum) || idNum <= 0)
      return res.status(400).json({ message: 'ID de empleador inválido' });

    const empleador = await Empleador.findByPk(idNum);
    if (!empleador) return res.status(404).json({ message: 'El empleador no existe' });

    const existePerfil = await PerfilEmpleador.findOne({ where: { empleadorId: idNum } });
    if (existePerfil) return res.status(400).json({ message: 'El perfil ya existe, usa PUT para actualizar' });

    // Parsear habilidades
    let habilidadesArray = [];
    if (habilidades) {
      try { habilidadesArray = JSON.parse(habilidades); } catch { habilidadesArray = []; }
    }

    // Crear carpetas si no existen
    fs.mkdirSync(path.join(__dirname, '../uploads/fotos'), { recursive: true });
    fs.mkdirSync(path.join(__dirname, '../uploads/cv'), { recursive: true });

    // Guardar archivos si vienen
    let cvUrl = null;
    let fotoUrl = null;

    if (req.files?.cv?.length > 0) {
      const cvName = `cv_${idNum}_${Date.now()}.pdf`;
      fs.writeFileSync(path.join(__dirname, '../uploads/cv', cvName), req.files.cv[0].buffer);
      cvUrl = `/uploads/cv/${cvName}`;
    }

    if (req.files?.foto?.length > 0) {
      const fotoName = `foto_${idNum}_${Date.now()}.jpg`;
      fs.writeFileSync(path.join(__dirname, '../uploads/fotos', fotoName), req.files.foto[0].buffer);
      fotoUrl = `/uploads/fotos/${fotoName}`;
    }

    // Crear perfil
    const perfil = await PerfilEmpleador.create({
      empleadorId: idNum,
      ubicacion: ubicacion || null,
      categoria: categoria || null,
      experiencia: experiencia ? parseInt(experiencia, 10) : 0,
      biografia: biografia || null,
      habilidades: habilidadesArray,
      cvUrl,
      fotoUrl,
    });

    res.status(201).json({ message: 'Perfil creado correctamente', perfil });
  } catch (error) {
    console.error('❌ Error al crear perfil:', error);
    res.status(500).json({ message: 'Error al crear perfil', error: error.message });
  }
};

// ==========================================================
// 🔹 Actualizar perfil existente del empleador (PUT)
// ==========================================================
exports.actualizarPerfil = async (req, res) => {
  try {
    const { empleadorId } = req.params;
    let { ubicacion, categoria, experiencia, biografia, habilidades } = req.body;

    const idNum = parseInt(empleadorId, 10);
    if (isNaN(idNum) || idNum <= 0)
      return res.status(400).json({ message: 'ID de empleador inválido' });

    // Buscar perfil existente
    let perfil = await PerfilEmpleador.findOne({ where: { empleadorId: idNum } });
    if (!perfil) return res.status(404).json({ message: 'Perfil no encontrado. Usa POST para crearlo primero' });

    // Parsear habilidades
    let habilidadesArray = [];
    if (habilidades) {
      try { habilidadesArray = JSON.parse(habilidades); } catch { habilidadesArray = []; }
    }

    // Crear carpetas si no existen
    fs.mkdirSync(path.join(__dirname, '../uploads/fotos'), { recursive: true });
    fs.mkdirSync(path.join(__dirname, '../uploads/cv'), { recursive: true });

    // Guardar archivos si vienen
    if (req.files?.cv?.length > 0) {
      const cvName = `cv_${idNum}_${Date.now()}.pdf`;
      fs.writeFileSync(path.join(__dirname, '../uploads/cv', cvName), req.files.cv[0].buffer);
      perfil.cvUrl = `/uploads/cv/${cvName}`;
    }

    if (req.files?.foto?.length > 0) {
      const fotoName = `foto_${idNum}_${Date.now()}.jpg`;
      fs.writeFileSync(path.join(__dirname, '../uploads/fotos', fotoName), req.files.foto[0].buffer);
      perfil.fotoUrl = `/uploads/fotos/${fotoName}`;
    }

    // Actualizar campos
    perfil.ubicacion = ubicacion ?? perfil.ubicacion;
    perfil.categoria = categoria ?? perfil.categoria;
    perfil.experiencia = experiencia ? parseInt(experiencia, 10) : perfil.experiencia;
    perfil.biografia = biografia ?? perfil.biografia;
    perfil.habilidades = habilidadesArray.length ? habilidadesArray : perfil.habilidades;

    await perfil.save();

    res.json({ message: 'Perfil actualizado correctamente', perfil });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
};
