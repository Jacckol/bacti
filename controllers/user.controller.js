const { User, Empleador } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'TU_SECRETO_JWT_AQUI'; // 🔹 Cambia esto a tu secreto real

module.exports = {
  // ==============================
  // Registrar usuario + datos de empleador
  // ==============================
  async registrar(req, res) {
    try {
      const { nombre, email, password, rol, empresa, ruc, telefono } = req.body;

      // Verificar si el correo ya existe
      const existe = await User.findOne({ where: { email } });
      if (existe) return res.status(400).json({ mensaje: 'El correo ya está registrado' });

      // Hashear contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const user = await User.create({ nombre, email, password: hashedPassword, rol });

      // Si es empleador, crear registro en tabla Empleador
      if (rol === 'empleador') {
        await Empleador.create({ empresa, ruc, telefono, userId: user.id });
      }

      res.status(201).json({ mensaje: 'Usuario creado correctamente', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  // ==============================
  // Login unificado
  // ==============================
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email e incluir datos de empleador si existen
      const user = await User.findOne({ where: { email }, include: ['empleador'] });
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      // Validar contraseña
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta' });

      // Generar token JWT
      const token = jwt.sign({ id: user.id, rol: user.rol }, JWT_SECRET, { expiresIn: '1d' });

      // 🔹 Verificar si el perfil del empleador está completo
      let perfilCompleto = false;
      let perfil = null;
      if (user.rol === 'empleador') {
        perfil = user.empleador;
        if (perfil && perfil.empresa && perfil.ruc && perfil.telefono) {
          perfilCompleto = true;
        }
      }

      // Respuesta para el frontend
      res.json({
        message: 'Login exitoso',
        token,
        rol: user.rol,
        user: { id: user.id, nombre: user.nombre },
        perfilCompleto
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error en login' });
    }
  },

  // ==============================
  // Listar usuarios
  // ==============================
  async listar(req, res) {
    try {
      const users = await User.findAll({ include: ['empleador'] });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ==============================
  // Actualizar usuario
  // ==============================
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email, password, rol } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      if (password) user.password = await bcrypt.hash(password, 10);
      await user.update({ nombre, email, rol });

      res.json({ mensaje: 'Usuario actualizado', user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // ==============================
  // Eliminar usuario
  // ==============================
  async eliminar(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

      await user.destroy();
      res.json({ mensaje: 'Usuario eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
