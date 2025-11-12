'use strict';
const express = require('express');
const router = express.Router();
const { PerfilEmpleador, Empleador, User } = require('../models');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// ==========================================================
// 🔹 Configuración de multer (archivos en memoria)
// ==========================================================
const upload = multer({ storage: multer.memoryStorage() });

// ==========================================================
// 🔹 Obtener solo el nombre del empleador por userId
// ==========================================================
router.get('/nombre/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId) || userId <= 0)
      return res.status(400).json({ message: 'ID de usuario inválido' });

    const empleador = await Empleador.findOne({
      where: { userId },
      attributes: ['id', 'nombre'], // solo id y nombre
    });

    if (!empleador) return res.status(404).json({ message: 'Empleador no encontrado' });

    res.json({ empleadorId: empleador.id, nombre: empleador.nombre });
  } catch (error) {
    console.error('❌ Error al obtener el nombre del empleador:', error);
    res.status(500).json({
      message: 'Error al obtener el nombre del empleador',
      error: error.message,
    });
  }
});

// ==========================================================
// 🔹 Crear nuevo perfil del empleador (POST)
// ==========================================================
router.post('/', upload.fields([{ name: 'foto' }, { name: 'cv' }]), async (req, res) => {
  try {
    const { empleadorId, ubicacion, categoria, experiencia, biografia, habilidades } = req.body;

    const idNum = parseInt(empleadorId, 10);
    if (isNaN(idNum) || idNum <= 0)
      return res.status(400).json({ message: 'ID de empleador inválido' });

    const empleador = await Empleador.findByPk(idNum);
    if (!empleador) return res.status(404).json({ message: 'El empleador no existe' });

    const existePerfil = await PerfilEmpleador.findOne({ where: { empleadorId: idNum } });
    if (existePerfil) return res.status(400).json({ message: 'El perfil ya existe, usa PUT para actualizar' });

    // Guardar archivos si existen
    let cvUrl = null;
    if (req.files?.cv?.length > 0) {
      const cvName = `cv_${idNum}_${Date.now()}.pdf`;
      fs.writeFileSync(path.join(__dirname, '../uploads/cv', cvName), req.files.cv[0].buffer);
      cvUrl = `/uploads/cv/${cvName}`;
    }

    let fotoUrl = null;
    if (req.files?.foto?.length > 0) {
      const fotoName = `foto_${idNum}_${Date.now()}.jpg`;
      fs.writeFileSync(path.join(__dirname, '../uploads/fotos', fotoName), req.files.foto[0].buffer);
      fotoUrl = `/uploads/fotos/${fotoName}`;
    }

    const perfil = await PerfilEmpleador.create({
      empleadorId: idNum,
      ubicacion: ubicacion || null,
      categoria: categoria || null,
      experiencia: experiencia ? parseInt(experiencia, 10) : 0,
      biografia: biografia || null,
      habilidades: habilidades ? JSON.parse(habilidades) : [],
      cvUrl,
      fotoUrl,
    });

    res.status(201).json({ message: 'Perfil creado correctamente', perfil });
  } catch (error) {
    console.error('❌ Error al crear perfil:', error);
    res.status(500).json({ message: 'Error al crear perfil', error: error.message });
  }
});

// ==========================================================
// 🔹 Actualizar perfil existente (PUT)
// ==========================================================
router.put('/:empleadorId', upload.fields([{ name: 'foto' }, { name: 'cv' }]), async (req, res) => {
  try {
    const idNum = parseInt(req.params.empleadorId, 10);
    if (isNaN(idNum) || idNum <= 0)
      return res.status(400).json({ message: 'ID de empleador inválido' });

    const perfil = await PerfilEmpleador.findOne({ where: { empleadorId: idNum } });
    if (!perfil) return res.status(404).json({ message: 'Perfil no encontrado. Usa POST para crearlo primero' });

    let { ubicacion, categoria, experiencia, biografia, habilidades } = req.body;
    if (habilidades && typeof habilidades === 'string') {
      try { habilidades = JSON.parse(habilidades); } catch { habilidades = []; }
    }

    // Actualizar archivos si se enviaron
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

    perfil.ubicacion = ubicacion ?? perfil.ubicacion;
    perfil.categoria = categoria ?? perfil.categoria;
    perfil.experiencia = experiencia ? parseInt(experiencia, 10) : perfil.experiencia;
    perfil.biografia = biografia ?? perfil.biografia;
    perfil.habilidades = habilidades ?? perfil.habilidades;

    await perfil.save();

    res.json({ message: 'Perfil actualizado correctamente', perfil });
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    res.status(500).json({ message: 'Error al actualizar perfil', error: error.message });
  }
});

module.exports = router;
