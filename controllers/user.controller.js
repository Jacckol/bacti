'use strict';

const { User, Trabajador, PerfilLaboral, Empleador } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'TU_SECRETO_JWT_AQUI';

module.exports = {

  // =====================================================
  // REGISTRO UNIFICADO
  // (Crea usuario + trabajador o empleador según rol)
  // =====================================================
  async registrar(req, res) {
    try {
      const {
        nombre, email, password, rol,
        telefono, direccion, categoria, experiencia, descripcion,
        empresa, ruc
      } = req.body;

      if (!nombre || !email || !password || !rol) {
        return res.status(400).json({ error: 'Faltan campos obligatorios.' });
      }

      // Validar email existente
      const existe = await User.findOne({ where: { email } });
      if (existe) return res.status(400).json({ error: 'El correo ya está registrado.' });

      // Crear usuario
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        nombre,
        email,
        password: hashedPassword,
        rol,
      });

      let trabajadorData = null;
      let empleadorData = null;

      // ------------------------------
      //    CREAR TRABAJADOR
      // ------------------------------
      if (rol === 'trabajador') {
        trabajadorData = await Trabajador.create({
          telefono: telefono || "",
          direccion: direccion || "",
          categoria: categoria || "",
          experiencia: experiencia || "",
          descripcion: descripcion || "",
          userId: user.id,
        });
      }

      // ------------------------------
      //    CREAR EMPLEADOR
      // ------------------------------
      if (rol === 'empleador') {
        empleadorData = await Empleador.create({
          empresa: empresa || "",
          ruc: ruc || "",
          telefono: telefono || "",
          userId: user.id,
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
        trabajador: trabajadorData,
        empleador: empleadorData,
      });

    } catch (error) {
      console.error('ERROR REGISTRAR:', error);
      res.status(500).json({ error: 'Error interno al registrar usuario.' });
    }
  },

  // =====================================================
  // LOGIN UNIFICADO (JWT + trabajador + empleador)
  // =====================================================
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        include: [
          { model: Trabajador, as: 'trabajador' },
          { model: Empleador, as: 'empleador' }
        ],
      });

      if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(400).json({ error: 'Contraseña incorrecta.' });

      // Generar token
      const token = jwt.sign(
        { id: user.id, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Verificar perfil laboral (solo trabajadores antiguos)
      const perfil = await PerfilLaboral.findOne({ where: { userId: user.id }});
      const perfilCompleto = perfil ? true : false;

      return res.json({
        message: 'Login exitoso',
        token,
        rol: user.rol,
        perfilCompleto,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
        },
        trabajador: user.trabajador || null,
        empleador: user.empleador || null,
      });

    } catch (err) {
      console.error('ERROR LOGIN:', err);
      res.status(500).json({ error: 'Error en login.' });
    }
  },

  // =====================================================
  // LISTAR USUARIOS
  // =====================================================
  async listar(req, res) {
    try {
      const usuarios = await User.findAll({
        include: [
          { model: Trabajador, as: 'trabajador' },
          { model: Empleador, as: 'empleador' }
        ],
      });

      res.json(usuarios);

    } catch (error) {
      console.error('ERROR LISTAR:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // =====================================================
  // ACTUALIZAR USUARIO
  // =====================================================
  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email, password, rol } = req.body;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }

      await user.update({ nombre, email, rol });

      res.json({ mensaje: 'Usuario actualizado.', user });

    } catch (error) {
      console.error('ERROR ACTUALIZAR:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // =====================================================
  // ELIMINAR USUARIO
  // =====================================================
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });

      await user.destroy();

      res.json({ mensaje: 'Usuario eliminado.' });

    } catch (error) {
      console.error('ERROR ELIMINAR:', error);
      res.status(500).json({ error: error.message });
    }
  },

};
