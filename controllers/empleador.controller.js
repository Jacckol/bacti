'use strict';
const { PerfilEmpleador, Empleador } = require('../models');

module.exports = {
  // 🟢 Crear o actualizar perfil del empleador
  async crearOActualizarPerfil(req, res) {
    try {
      const { empleadorId, ubicacion, categoria, experiencia, biografia, habilidades } = req.body;

      if (!empleadorId) {
        return res.status(400).json({ message: 'Falta el ID del empleador.' });
      }

      // Buscar si ya existe un perfil para este empleador
      let perfil = await PerfilEmpleador.findOne({ where: { empleadorId } });

      if (perfil) {
        // Actualizar si ya existe
        await perfil.update({ ubicacion, categoria, experiencia, biografia, habilidades });
        return res.json({ message: 'Perfil actualizado correctamente', perfil });
      } else {
        // Crear si no existe
        const nuevoPerfil = await PerfilEmpleador.create({
          empleadorId,
          ubicacion,
          categoria,
          experiencia,
          biografia,
          habilidades,
        });
        return res.status(201).json({ message: 'Perfil creado correctamente', perfil: nuevoPerfil });
      }
    } catch (error) {
      console.error('Error al crear o actualizar perfil:', error);
      return res.status(500).json({ message: 'Error interno del servidor', error });
    }
  },

  // 🟣 Obtener perfil por empleadorId
  async obtenerPerfilPorEmpleador(req, res) {
    try {
      const { empleadorId } = req.params;
      const perfil = await PerfilEmpleador.findOne({
        where: { empleadorId },
        include: [{ model: Empleador, as: 'empleador' }],
      });

      if (!perfil) {
        return res.status(404).json({ message: 'Perfil no encontrado' });
      }

      return res.json({ message: 'Perfil obtenido correctamente', perfil });
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return res.status(500).json({ message: 'Error interno del servidor', error });
    }
  },

  // 🟡 Listar todos los perfiles
  async listarPerfiles(req, res) {
    try {
      const perfiles = await PerfilEmpleador.findAll({
        include: [{ model: Empleador, as: 'empleador' }],
      });
      return res.json({ message: 'Perfiles obtenidos correctamente', perfiles });
    } catch (error) {
      console.error('Error al listar perfiles:', error);
      return res.status(500).json({ message: 'Error interno del servidor', error });
    }
  },

  // 🔴 Eliminar perfil
  async eliminarPerfil(req, res) {
    try {
      const { id } = req.params;
      const perfil = await PerfilEmpleador.findByPk(id);
      if (!perfil) {
        return res.status(404).json({ message: 'Perfil no encontrado' });
      }

      await perfil.destroy();
      return res.json({ message: 'Perfil eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar perfil:', error);
      return res.status(500).json({ message: 'Error interno del servidor', error });
    }
  },
};
