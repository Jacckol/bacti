'use strict';

const { User, Trabajador, Empleador, PerfilLaboral } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'TU_SECRETO_JWT_AQUI';

module.exports = {

  // =====================================================
  // REGISTRO (COMPATIBLE CON FRONT ANTIGUO)
  // =====================================================
  async registrar(req, res) {
    try {
      let {
        nombre,
        email,
        password,
        rol,
        telefono,
        direccion,
        categoria,
        experiencia,
        descripcion,
        empresa,
        ruc
      } = req.body;

      // 👉 compatibilidad total con el front antiguo
      if (!rol) rol = 'trabajador';

      if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Datos incompletos' });
      }

      const existe = await User.findOne({ where: { email } });
      if (existe) {
        return res.status(400).json({ error: 'Correo ya registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // ===== USER =====
      const user = await User.create({
        nombre,
        email,
        password: hashedPassword,
        rol,
      });

      let trabajador = null;
      let empleador = null;

      // ===== TRABAJADOR =====
      if (rol === 'trabajador') {
        trabajador = await Trabajador.create({
          nombre: nombre,
          telefono: telefono || '',
          direccion: direccion || '',
          categoria: categoria || '',
          experiencia: experiencia || '',
          descripcion: descripcion || '',
          horario: '',
          userId: user.id,
        });
      }

      // ===== EMPLEADOR =====
      if (rol === 'empleador') {
        empleador = await Empleador.create({
          nombre: nombre,
          empresa: empresa || '',
          ruc: ruc || '',
          telefono: telefono || '',
          userId: user.id,
        });
      }

      return res.status(200).json({
        mensaje: 'Usuario registrado correctamente',
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
        trabajador,
        empleador,
      });

    } catch (error) {
      console.error('ERROR REGISTER:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // =====================================================
  // LOGIN (ESTABLE)
  // =====================================================
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        where: { email },
        include: [
          { model: Trabajador, as: 'trabajador' },
          { model: Empleador, as: 'empleador' },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign(
        { id: user.id, rol: user.rol },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      const perfil = await PerfilLaboral.findOne({
        where: { userId: user.id },
      });

      return res.json({
        token,
        rol: user.rol,
        perfilCompleto: !!perfil,
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
        },
        trabajador: user.trabajador || null,
        empleador: user.empleador || null,
      });

    } catch (error) {
      console.error('ERROR LOGIN:', error);
      return res.status(500).json({ error: 'Error en login' });
    }
  },

};
