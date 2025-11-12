const express = require('express');
const router = express.Router();
const { Empleador, User } = require('../models');

// GET /api/empleadores -> lista todos los empleadores con info del usuario
router.get('/', async (req, res) => {
  try {
    const empleadores = await Empleador.findAll({
      include: {
        model: User,
        attributes: ['id', 'nombre', 'email', 'rol']
      }
    });
    res.json({ message: 'Lista de empleadores obtenida', empleadores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener empleadores' });
  }
});

// POST /api/empleadores -> crear nuevo empleador
router.post('/', async (req, res) => {
  try {
    const { empresa, telefono, rol, userId } = req.body;

    if (!empresa || !telefono || !rol || !userId) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ error: 'Usuario asociado no encontrado' });

    const newEmpleador = await Empleador.create({ empresa, telefono, rol, userId });
    res.status(201).json({ message: 'Empleador creado exitosamente', empleador: newEmpleador });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear empleador' });
  }
});

// DELETE /api/empleadores/:id -> eliminar un empleador
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const empleador = await Empleador.findByPk(id);
    if (!empleador) return res.status(404).json({ error: 'Empleador no encontrado' });

    await empleador.destroy();
    res.json({ message: 'Empleador eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar empleador' });
  }
});

module.exports = router;
