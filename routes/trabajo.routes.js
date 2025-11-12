const express = require('express');
const router = express.Router();
const { Trabajo, Empleador } = require('../models');

// ===========================
// 📌 Crear un nuevo trabajo
// ===========================
router.post('/publicar', async (req, res) => {
  try {
    const {
      titulo,
      categoria,
      descripcion,
      ubicacion,
      duracion,
      presupuesto,
      empleadorId,
    } = req.body;

    // 🔹 Validación de campos
    if (!titulo || !categoria || !descripcion || !ubicacion || !duracion || !presupuesto || !empleadorId) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    // 🔹 Verificar empleador
    const empleador = await Empleador.findByPk(empleadorId);
    if (!empleador)
      return res.status(404).json({ error: 'Empleador no encontrado.' });

    // 🔹 Crear el trabajo
    const nuevoTrabajo = await Trabajo.create({
      titulo,
      categoria,
      descripcion,
      ubicacion,
      duracion,
      presupuesto,
      empleadorId,
    });

    res.status(201).json({
      mensaje: '✅ Trabajo publicado con éxito',
      trabajo: nuevoTrabajo,
    });
  } catch (error) {
    console.error('❌ Error al publicar trabajo:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

// ===========================
// 📌 Obtener todos los trabajos
// ===========================
router.get('/', async (req, res) => {
  try {
    const trabajos = await Trabajo.findAll({
      include: {
        model: Empleador,
        as: 'empleador',
        attributes: ['id', 'nombreEmpresa', 'ruc', 'telefono'],
      },
      order: [['createdAt', 'DESC']],
    });

    res.json(trabajos);
  } catch (error) {
    console.error('❌ Error al obtener trabajos:', error);
    res.status(500).json({ error: 'Error al obtener los trabajos.' });
  }
});

// ===========================
// 📌 Obtener trabajos por empleador
// ===========================
router.get('/empleador/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const empleador = await Empleador.findByPk(id);
    if (!empleador)
      return res.status(404).json({ error: 'Empleador no encontrado.' });

    const trabajos = await Trabajo.findAll({
      where: { empleadorId: id },
      order: [['createdAt', 'DESC']],
    });

    res.json(trabajos);
  } catch (error) {
    console.error('❌ Error al obtener trabajos por empleador:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

// ===========================
// 📌 Eliminar un trabajo
// ===========================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const trabajo = await Trabajo.findByPk(id);
    if (!trabajo)
      return res.status(404).json({ error: 'Trabajo no encontrado.' });

    await trabajo.destroy();

    res.json({ mensaje: '🗑️ Trabajo eliminado correctamente.' });
  } catch (error) {
    console.error('❌ Error al eliminar trabajo:', error);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

module.exports = router;
