'use strict';
const express = require('express');
const router = express.Router();
const { User, Empleador } = require('../models');
const bcrypt = require('bcrypt');

// POST /api/register -> Registrar usuario empleador o user normal
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol, empresa, telefono } = req.body;

    // Validación básica
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar email repetido
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'El correo ya existe' });

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    // Si es empleador, crear entrada en la tabla empleadores
    let empleador = null;
    if (rol === 'empleador') {
      if (!empresa || !telefono) {
        return res.status(400).json({ error: 'Faltan datos del empleador' });
      }

      empleador = await Empleador.create({
        userId: newUser.id,
        empresa,
        telefono
      });
    }

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: newUser,
      empleador
    });

  } catch (err) {
    console.error('❌ Error en /register:', err);
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

module.exports = router;
