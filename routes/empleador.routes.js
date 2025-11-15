const express = require('express');
const router = express.Router();
const { Empleador, User } = require('../models');

// ============================================
// 🔹 LISTAR TODOS LOS EMPLEADORES
// ============================================
router.get('/', async (req, res) => {
  try {
    const empleadores = await Empleador.findAll({
      include: {
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email', 'rol']
      }
    });

    res.json({
      message: 'Lista de empleadores obtenida correctamente.',
      empleadores
    });
  } catch (error) {
    console.error('Error al obtener empleadores:', error);
    res.status(500).json({ error: 'Error al obtener empleadores.' });
  }
});

// ============================================
// 🔹 OBTENER UN EMPLEADOR POR ID
// ============================================
router.get('/:id', async (req, res) => {
  try {
    const empleador = await Empleador.findByPk(req.params.id, {
      include: {
        model: User,
        as: 'usuario',
        attributes: ['id', 'nombre', 'email', 'rol']
      }
    });

    if (!empleador) {
      return res.status(404).json({ error: 'Empleador no encontrado.' });
    }

    res.json({ empleador });
  } catch (error) {
    console.error('Error al obtener empleador:', error);
    res.status(500).json({ error: 'Error al obtener empleador.' });
  }
});

// ============================================
// 🔹 CREAR UN EMPLEADOR
// ============================================
router.post('/', async (req, res) => {
  try {
    const { empresa, ruc, telefono, userId } = req.body;

    if (!empresa || !ruc || !telefono || !userId) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // Verificar que el usuario exista
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario asociado no encontrado.' });

    const nuevoEmpleador = await Empleador.create({
      empresa,
      ruc,
      telefono,
      userId
    });

    res.status(201).json({
      message: 'Empleador creado correctamente.',
      empleador: nuevoEmpleador
    });

  } catch (error) {
    console.error('Error al crear empleador:', error);
    res.status(500).json({ error: 'Error al crear empleador.' });
  }
});

// ============================================
// 🔹 ACTUALIZAR UN EMPLEADOR
// ============================================
router.put('/:id', async (req, res) => {
  try {
    const { empresa, ruc, telefono } = req.body;

    const empleador = await Empleador.findByPk(req.params.id);
    if (!empleador) {
      return res.status(404).json({ error: 'Empleador no encontrado.' });
    }

    await empleador.update({ empresa, ruc, telefono });

    res.json({
      message: 'Empleador actualizado correctamente.',
      empleador
    });

  } catch (error) {
    console.error('Error al actualizar empleador:', error);
    res.status(500).json({ error: 'Error al actualizar empleador.' });
  }
});

// ============================================
// 🔹 ELIMINAR UN EMPLEADOR
// ============================================
router.delete('/:id', async (req, res) => {
  try {
    const empleador = await Empleador.findByPk(req.params.id);

    if (!empleador) {
      return res.status(404).json({ error: 'Empleador no encontrado.' });
    }

    await empleador.destroy();

    res.json({ message: 'Empleador eliminado correctamente.' });

  } catch (error) {
    console.error('Error al eliminar empleador:', error);
    res.status(500).json({ error: 'Error al eliminar empleador.' });
  }
});

module.exports = router;
