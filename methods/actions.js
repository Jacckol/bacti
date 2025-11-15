'use strict';

const { User, Empleador, Post } = require('../models'); 
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');
require('dotenv').config();

const functions = {

  // =============================
  // 📌 REGISTRAR NUEVO USUARIO
  // =============================
  addNew: async function (req, res) {
    try {
      const { nombre, email, password, rol } = req.body;

      if (!nombre || !email || !password || !rol) {
        return res.json({ success: false, msg: 'Faltan campos obligatorios' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.json({ success: false, msg: 'El correo ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        nombre,
        email,
        password: hashedPassword,
        rol,
      });

      return res.json({
        success: true,
        msg: 'Usuario registrado exitosamente',
        user: newUser,
      });

    } catch (error) {
      console.error('❌ Error en addNew:', error);
      return res.status(500).json({ success: false, msg: 'Error al registrar usuario' });
    }
  },

  // =============================
  // 📌 LOGIN
  // =============================
  authenticate: async function (req, res) {
    try {

      const { email, password } = req.body;

      if (!email || !password) {
        return res.json({ success: false, msg: 'Faltan credenciales' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(403).json({ success: false, msg: 'Usuario no encontrado' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(403).json({ success: false, msg: 'Contraseña incorrecta' });
      }

      // Crear token
      const payload = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      };

      const token = jwt.encode(payload, process.env.SECRET);

      // =============================
      // 📌 Verificar si perfil está completo (empleador)
      // =============================
      let perfilCompleto = false;

      if (user.rol === 'empleador') {
        const empleador = await Empleador.findOne({ where: { userId: user.id } });
        perfilCompleto = !!empleador;
      }

      return res.json({
        success: true,
        msg: 'Inicio de sesión exitoso',
        token,
        user: payload,
        rol: user.rol,
        perfilCompleto,
      });

    } catch (error) {
      console.error('❌ Error en authenticate:', error);
      return res.status(500).json({ success: false, msg: 'Error al autenticar usuario' });
    }
  },

  // =============================
  // 📌 OBTENER INFO DE USUARIO
  // =============================
  getinfo: function (req, res) {
    try {

      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.decode(token, process.env.SECRET);

        return res.json({
          success: true,
          msg: `Hola ${decodedToken.nombre}`,
          user: decodedToken,
        });
      } else {
        return res.json({ success: false, msg: 'No se proporcionó token' });
      }

    } catch (error) {
      console.error('❌ Error en getinfo:', error);
      return res.status(401).json({ success: false, msg: 'Token inválido' });
    }
  },

  // =============================
  // 📌 CRUD POSTS
  // =============================

  addPost: async function (req, res) {
    try {
      const { title, body, author, author_id } = req.body;

      if (!title || !body || !author || !author_id) {
        return res.json({ success: false, msg: 'Por favor, ingrese todos los campos' });
      }

      const newPost = await Post.create({ title, body, author, author_id });
      return res.json({ success: true, msg: 'Post guardado exitosamente', post: newPost });

    } catch (error) {
      console.error('❌ Error en addPost:', error);
      return res.status(500).json({ success: false, msg: 'Error al guardar post' });
    }
  },

  getAllPost: async function (req, res) {
    try {
      const posts = await Post.findAll();
      return res.json(posts);

    } catch (error) {
      console.error('❌ Error en getAllPost:', error);
      return res.status(500).json({ success: false, msg: 'Error al obtener posts' });
    }
  },

  getPostbyId: async function (req, res) {
    try {
      const post = await Post.findByPk(req.params.id);

      if (!post)
        return res.status(404).json({ success: false, msg: 'Post no encontrado' });

      return res.json(post);

    } catch (error) {
      console.error('❌ Error en getPostbyId:', error);
      return res.status(500).json({ success: false, msg: 'Error al obtener post' });
    }
  },

  getPostbyAuthorId: async function (req, res) {
    try {
      const posts = await Post.findAll({ where: { author_id: req.params.id } });
      return res.json(posts);

    } catch (error) {
      console.error('❌ Error en getPostbyAuthorId:', error);
      return res.status(500).json({ success: false, msg: 'Error al obtener posts' });
    }
  },

  searchPost: async function (req, res) {
    try {
      const title = req.params.title;

      const posts = await Post.findAll({
        where: {
          title: {
            [require('sequelize').Op.iLike]: `%${title}%`,
          },
        },
      });

      return res.json(posts);

    } catch (error) {
      console.error('❌ Error en searchPost:', error);
      return res.status(500).json({ success: false, msg: 'Error al buscar posts' });
    }
  },

  deletePost: async function (req, res) {
    try {
      const deleted = await Post.destroy({ where: { id: req.params.id } });

      if (!deleted)
        return res.status(404).json({ success: false, msg: 'Post no encontrado' });

      return res.json({ success: true, msg: 'Post eliminado correctamente' });

    } catch (error) {
      console.error('❌ Error en deletePost:', error);
      return res.status(500).json({ success: false, msg: 'Error al eliminar post' });
    }
  },

  updatePost: async function (req, res) {
    try {
      const { title, body, author, author_id } = req.body;

      const updated = await Post.update(
        { title, body, author, author_id },
        { where: { id: req.params.id } }
      );

      if (!updated[0])
        return res.status(404).json({ success: false, msg: 'Post no encontrado' });

      return res.json({ success: true, msg: 'Post actualizado correctamente' });

    } catch (error) {
      console.error('❌ Error en updatePost:', error);
      return res.status(500).json({ success: false, msg: 'Error al actualizar post' });
    }
  },
};

module.exports = functions;
