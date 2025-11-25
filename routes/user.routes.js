'use strict';
const express = require('express');
const router = express.Router();
const { User, Trabajador } = require('../models');
const bcrypt = require('bcrypt');

// POST /api/register -> Registrar usuario trabajador o cliente
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol, telefono, direccion, categoria, experiencia, descripcion } = req.body;

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

    // Si el rol es trabajador, crear su registro laboral
    let trabajador = null;

    if (rol === 'trabajador') {
      trabajador = await Trabajador.create({
        userId: newUser.id,
        telefono: telefono || null,
        direccion: direccion || null,
        categoria: categoria || null,
        experiencia: experiencia || null,
        descripcion: descripcion || null
      });
    }

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: newUser,
      trabajador
    });

  } catch (err) {
    console.error('❌ Error en /register:', err);
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

module.exports = router;
