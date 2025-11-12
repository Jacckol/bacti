const express = require('express');
const router = express.Router();
const { User, Empleador } = require('../models');
const bcrypt = require('bcrypt');

// 🔹 POST /api/register -> Registrar usuario o empleador
router.post('/register', async (req, res) => {
  try {
    const { nombre, email, password, rol, empresa, telefono } = req.body;

    // Validar datos base
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Evitar correos duplicados
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ error: 'El correo ya está registrado' });

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await User.create({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    // Si es empleador, crear su registro asociado
    if (rol === 'empleador') {
      if (!empresa || !telefono) {
        return res.status(400).json({ error: 'Faltan datos de empresa para empleador' });
      }

      const newEmpleador = await Empleador.create({
        empresa,
        telefono,
        rol,       // ✅ reemplazamos ruc por rol
        userId: newUser.id
      });

      return res.status(201).json({
        message: 'Empleador registrado exitosamente',
        user: newUser,
        empleador: newEmpleador
      });
    }

    // Si no es empleador (cliente normal)
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: newUser });
  } catch (err) {
    console.error('❌ Error en /register:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// 🔹 GET /api/register -> Listar todos los usuarios
router.get('/register', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt', 'updatedAt'],
      include: {
        model: Empleador,
        as: 'empleador', // alias definido en User.hasOne(Empleador)
        attributes: ['id', 'empresa', 'telefono', 'rol'] // ✅ aquí también cambiamos ruc → rol
      }
    });

    res.json({ message: 'Usuarios obtenidos correctamente', users });
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// 🔹 GET /api/register/:id -> Obtener un usuario por ID
router.get('/register/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'nombre', 'email', 'rol', 'createdAt', 'updatedAt'],
      include: {
        model: Empleador,
        as: 'empleador',
        attributes: ['id', 'empresa', 'telefono', 'rol'] // ✅ igual aquí
      }
    });

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.json({ message: 'Usuario obtenido correctamente', user });
  } catch (err) {
    console.error('❌ Error al obtener usuario:', err);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// 🔹 DELETE /api/register/:id -> Eliminar usuario (y su empleador)
router.delete('/register/:id', async (req, res) => {
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

// 🔹 PUT /api/register/:id -> Actualizar usuario
router.put('/register/:id', async (req, res) => {
  try {
    const { nombre, email, rol, password } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (password) user.password = await bcrypt.hash(password, 10);
    if (nombre) user.nombre = nombre;
    if (email) user.email = email;
    if (rol) user.rol = rol;

    await user.save();

    res.json({ message: 'Usuario actualizado correctamente', user });
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

module.exports = router;
