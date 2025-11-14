'use strict';
const fs = require('fs');
const path = require('path');
const { PerfilEmpleador, Empleador, CompleteProfileForm } = require('../models');
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

    // Obtener datos del CompleteProfileForm para autocompletar
    const form = await CompleteProfileForm.findOne({ where: { empleadorId: idNum } });
    if (!form) return res.status(404).json({ message: 'No se encontró el formulario para autocompletar' });

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

    // Crear perfil usando datos autocompletados de CompleteProfileForm
    const perfil = await PerfilEmpleador.create({
      empleadorId: idNum,
      nombre: form.nombre,           // 🔹 Solo lectura
      cedula_ruc: form.cedula_ruc,   // 🔹 Solo lectura
      telefono: form.telefono || null,
      ubicacion: ubicacion || form.ubicacion || null,
      categoria: categoria || form.categoria || null,
      experiencia: experiencia ? parseInt(experiencia, 10) : form.experiencia || 0,
      biografia: biografia || form.biografia || null,
      habilidades: habilidadesArray.length ? habilidadesArray : form.habilidades || [],
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

    // Actualizar campos **excepto nombre y cedula_ruc**
    perfil.telefono = perfil.telefono || perfil.telefono; // opcional, puedes permitir actualizar si quieres
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

// ==========================================================
// 🔹 Obtener perfil desde CompleteProfileForm para autocompletar (GET)
// ==========================================================
exports.obtenerPerfilDesdeFormulario = async (req, res) => {
  try {
    const { formId } = req.params;

    if (!formId || isNaN(parseInt(formId, 10))) {
      return res.status(400).json({ message: 'ID de formulario inválido' });
    }

    const form = await CompleteProfileForm.findByPk(formId);

    if (!form) return res.status(404).json({ message: 'Formulario no encontrado' });

    res.json({
      nombre: form.nombre,
      telefono: form.telefono,
      cedula_ruc: form.cedula_ruc,
      ubicacion: form.ubicacion,
      categoria: form.categoria,
      experiencia: form.experiencia,
      biografia: form.biografia,
      habilidades: form.habilidades,
      fotoUrl: form.fotoUrl,
      cvUrl: form.cvUrl,
    });
  } catch (error) {
    console.error('❌ Error al obtener datos del formulario:', error);
    res.status(500).json({ message: 'Error al obtener datos del formulario', error: error.message });
  }
};
