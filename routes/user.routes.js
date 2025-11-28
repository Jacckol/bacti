'use strict';

const express = require('express');
const router = express.Router();
const { User, Trabajador, Empleador } = require('../models');
const bcrypt = require('bcrypt');

// =====================================================
// 🔥 REGISTRO UNIFICADO (TRABAJADOR + EMPLEADOR)
// =====================================================
router.post('/register', async (req, res) => {
  try {
    const {
      nombre, email, password, rol,
      telefono, direccion, categoria, experiencia, descripcion,
      empresa, ruc, responsable
    } = req.body;

    // Validación básica
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Validar email existente
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

    let trabajador = null;
    let empleador = null;

    // =====================================================
    // 🟩 REGISTRO TRABAJADOR
    // =====================================================
    if (rol === 'trabajador') {
      trabajador = await Trabajador.create({
        userId: newUser.id,
        telefono: telefono || "",
        direccion: direccion || "",
        categoria: categoria || "",
        experiencia: experiencia || "",
        descripcion: descripcion || ""
      });
    }

    // =====================================================
    // 🟦 REGISTRO EMPLEADOR
    // (Tu modelo exige responsable y direccion OBLIGATORIOS)
    // =====================================================
    if (rol === 'empleador') {
      // Validar campos obligatorios para tu modelo
      if (!empresa || !ruc || !responsable || !direccion) {
        return res.status(400).json({
          error: "Faltan campos obligatorios para empleador (empresa, ruc, responsable, direccion)"
        });
      }

      empleador = await Empleador.create({
        userId: newUser.id,
        empresa,
        ruc,
        responsable,
        telefono: telefono || "",
        direccion,
        foto_url: null
      });
    }

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: newUser,
      trabajador,
      empleador
    });

  } catch (err) {
    console.error('❌ Error en /register:', err);
    return res.status(500).json({ error: 'Error al registrar usuario' });
  }
});


// =====================================================
// LISTAR TODOS (TRABAJADORES + EMPLEADORES)
// =====================================================
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Trabajador, as: 'trabajador' },
        { model: Empleador, as: 'empleador' }
      ]
    });

    res.json({ message: 'Usuarios obtenidos correctamente', users });

  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});


// =====================================================
// OBTENER USUARIO POR ID
// =====================================================
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Trabajador, as: 'trabajador' },
        { model: Empleador, as: 'empleador' }
      ]
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Usuario obtenido correctamente', user });

  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});


// =====================================================
// ELIMINAR USUARIO
// =====================================================
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    await user.destroy();

    res.json({ message: 'Usuario eliminado correctamente' });

  } catch (err) {
    console.error('❌ Error al eliminar usuario:', err);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


// =====================================================
// ACTUALIZAR USUARIO
// =====================================================
router.put('/users/:id', async (req, res) => {
  try {
    const { nombre, email, rol, password } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (password) user.password = await bcrypt.hash(password, 10);

    await user.update({ nombre, email, rol });

    res.json({ message: 'Usuario actualizado correctamente', user });

  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

module.exports = router;
