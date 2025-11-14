'use strict';
const { PerfilLaboral } = require('../models');

// 🔹 ID por defecto solo para pruebas
const DEFAULT_EMPLEADOR_ID = 1;

// 🔹 Crear un nuevo perfil laboral (sin token)
exports.crearPerfilLaboral = async (req, res) => {
  try {
    const {
      nombreCompleto,
      cedulaRuc,
      telefono,
      nombreComercial,
      categoria,
      descripcion,
      direccion,
      horario,
      experiencia,
    } = req.body;

    const perfil = await PerfilLaboral.create({
      empleadorId: DEFAULT_EMPLEADOR_ID, // 🔹 Se asigna por defecto
      nombreCompleto,
      cedulaRuc,
      telefono,
      nombreComercial,
      categoria,
      descripcion,
      direccion,
      horario,
      experiencia,
    });

    res.status(201).json({
      message: 'Perfil laboral creado correctamente',
      perfil,
    });
  } catch (error) {
    console.error('Error al crear el perfil laboral:', error);
    res.status(500).json({ message: 'Error al crear el perfil laboral', error });
  }
};

// 🔹 Obtener perfil laboral por empleadorId (sin token)
exports.obtenerPerfilDelEmpleador = async (req, res) => {
  try {
    const empleadorId = DEFAULT_EMPLEADOR_ID; // 🔹 Por defecto

    const perfil = await PerfilLaboral.findOne({ where: { empleadorId } });

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil laboral no encontrado' });
    }

    res.json(perfil);
  } catch (error) {
    console.error('Error al obtener perfil laboral:', error);
    res.status(500).json({ message: 'Error al obtener perfil laboral', error });
  }
};

// 🔹 Actualizar perfil laboral por empleadorId (sin token)
exports.actualizarPerfilLaboral = async (req, res) => {
  try {
    const empleadorId = DEFAULT_EMPLEADOR_ID; // 🔹 Por defecto

    const perfil = await PerfilLaboral.findOne({ where: { empleadorId } });

    if (!perfil) {
      return res.status(404).json({ message: 'Perfil laboral no encontrado' });
    }

    await perfil.update(req.body);

    res.json({ message: 'Perfil actualizado correctamente', perfil });
  } catch (error) {
    console.error('Error al actualizar perfil laboral:', error);
    res.status(500).json({ message: 'Error al actualizar perfil laboral', error });
  }
};

// 🔹 Obtener todos los perfiles laborales (opcional para pruebas)
exports.obtenerTodosPerfilesLaborales = async (req, res) => {
  try {
    const perfiles = await PerfilLaboral.findAll();

    res.json({
      message: 'Perfiles laborales obtenidos correctamente',
      perfiles,
    });
  } catch (error) {
    console.error('Error al obtener perfiles laborales:', error);
    res.status(500).json({ message: 'Error al obtener perfiles laborales', error });
  }
};
