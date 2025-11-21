'use strict';

const { PerfilLaboral, Empleador, User } = require('../models');

// =======================================================
// 🔹 1. Crear perfil laboral
// =======================================================
exports.crearPerfilLaboral = async (req, res) => {
  try {
    const userId = req.user.id; // viene del token

    const {
      nombreCompleto,
      cedulaRuc,
      telefono,
      nombreComercial,
      categoria,
      descripcion,
      direccion,
      horario,
      experiencia
    } = req.body;

    // Verificar si ya existe un perfil para este usuario
    const existente = await PerfilLaboral.findOne({ where: { userId } });
    if (existente) {
      return res.status(400).json({ message: 'El perfil ya existe' });
    }

    // Crear el perfil
    const perfil = await PerfilLaboral.create({
      userId,
      nombreCompleto,
      cedulaRuc,
      telefono,
      nombreComercial,
      categoria,
      descripcion,
      direccion,
      horario,
      experiencia
    });

    return res.status(201).json({
      message: 'Perfil creado correctamente',
      perfil
    });

  } catch (error) {
    console.error("❌ Error al crear perfil:", error);
    return res.status(500).json({ message: 'Error al crear perfil laboral' });
  }
};

// =======================================================
// 🔹 2. Obtener perfil del usuario logueado
// =======================================================
exports.obtenerPerfilDelEmpleador = async (req, res) => {
  try {
    const userId = req.user.id;

    const perfil = await PerfilLaboral.findOne({ where: { userId } });

    if (!perfil) {
      return res.status(404).json({ message: 'No tienes perfil creado aún' });
    }

    return res.json({
      message: 'Perfil obtenido correctamente',
      perfil
    });

  } catch (error) {
    console.error("❌ Error obteniendo perfil:", error);
    return res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

// =======================================================
// 🔹 3. Verificar si el perfil existe (USADO POR FLUTTER)
//     GET /api/perfil-laboral/mine
// =======================================================
exports.verificarPerfilExistente = async (req, res) => {
  try {
    const userId = req.user.id;

    const perfil = await PerfilLaboral.findOne({ where: { userId } });

    // ⚠️ Flutter necesita esto exactamente:
    return res.json({
      exists: perfil ? true : false
    });

  } catch (error) {
    console.error("❌ Error verificando perfil:", error);
    return res.status(500).json({ message: 'Error en verificación' });
  }
};

// =======================================================
// 🔹 4. Actualizar perfil laboral
// =======================================================
exports.actualizarPerfilLaboral = async (req, res) => {
  try {
    const userId = req.user.id;

    const perfil = await PerfilLaboral.findOne({ where: { userId } });

    if (!perfil) {
      return res.status(404).json({ message: 'No tienes perfil creado aún' });
    }

    await perfil.update(req.body);

    return res.json({
      message: 'Perfil actualizado correctamente',
      perfil
    });

  } catch (error) {
    console.error("❌ Error actualizando perfil:", error);
    return res.status(500).json({ message: 'Error al actualizar perfil laboral' });
  }
};

// =======================================================
// 🔹 5. Obtener todos los perfiles laborales
// =======================================================
exports.obtenerTodosPerfilesLaborales = async (req, res) => {
  try {
    const perfiles = await PerfilLaboral.findAll();

    return res.json({
      message: 'Perfiles obtenidos correctamente',
      perfiles
    });

  } catch (error) {
    console.error("❌ Error obteniendo perfiles:", error);
    return res.status(500).json({ message: 'Error al obtener perfiles laborales' });
  }
};
