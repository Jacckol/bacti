const { User, Empleador } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'TU_SECRETO_JWT_AQUI';

module.exports = {

  // ========================================
  // REGISTRO
  // ========================================
  async registrar(req, res) {
    try {
      const { nombre, email, password, rol, empresa, ruc, telefono } = req.body;

      // Validar campos básicos
      if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ error: 'Faltan campos obligatorios del usuario.' });
      }

      // Verificar si el correo ya existe
      const existe = await User.findOne({ where: { email } });
      if (existe) return res.status(400).json({ error: 'El correo ya está registrado' });

      // Encriptar contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear usuario
      const user = await User.create({
        nombre,
        email,
        password: hashedPassword,
        rol
      });

      let empleadorData = null;

      // Si es empleador: crear registro en tabla Empleador
      if (rol === 'empleador') {

        if (!empresa || !ruc || !telefono) {
          return res.status(400).json({ error: 'Faltan datos obligatorios del empleador.' });
        }

        empleadorData = await Empleador.create({
          empresa,
          ruc,
          telefono,
          userId: user.id
        });
      }

      return res.status(201).json({
        mensaje: 'Usuario creado correctamente',
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol
        },
        empleador: empleadorData
      });

    } catch (error) {
      console.error('Error registrar usuario:', error);
      res.status(500).json({ error: 'Error interno al registrar usuario.' });
    }
  },


  // ========================================
  // LOGIN
  // ========================================
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Buscar usuario e incluir datos de Empleador (si los tiene)
      const user = await User.findOne({
        where: { email },
        include: [{ model: Empleador, as: 'empleador' }]
      });

      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      // Validar contraseña
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta' });

      // Crear token
      const token = jwt.sign(
        { id: user.id, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.json({
        message: 'Login exitoso',
        token,
        rol: user.rol,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email
        },
        empleador: user.empleador || null
      });

    } catch (err) {
      console.error('Error login:', err);
      res.status(500).json({ error: 'Error en login' });
    }
  },


  // ========================================
  // LISTAR USUARIOS
  // ========================================
  async listar(req, res) {
    try {
      const users = await User.findAll({
        include: [{ model: Empleador, as: 'empleador' }]
      });

      res.json(users);

    } catch (error) {
      console.error('Error listar usuarios:', error);
      res.status(500).json({ error: error.message });
    }
  },


  // ========================================
  // ACTUALIZAR USUARIO
  // ========================================
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email, password, rol } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      await user.update({ nombre, email, rol });

      res.json({
        mensaje: 'Usuario actualizado',
        user
      });

    } catch (error) {
      console.error('Error actualizar usuario:', error);
      res.status(500).json({ error: error.message });
    }
  },


  // ========================================
  // ELIMINAR USUARIO
  // ========================================
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

      await user.destroy();

      res.json({ mensaje: 'Usuario eliminado' });

    } catch (error) {
      console.error('Error eliminar usuario:', error);
      res.status(500).json({ error: error.message });
    }
  }
};
