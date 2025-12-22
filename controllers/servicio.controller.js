'use strict';

const db = require("../models");
const { Op } = require("sequelize");
const { crearNotificacion } = require("../methods/notificar");

const { Servicio, Postulacion, User } = db;

module.exports = {

  // =====================================================
  // 🟢 CREAR SERVICIO
  // POST /api/servicios
  // =====================================================
  async crear(req, res) {
    try {
      const nuevo = await Servicio.create({
        titulo: req.body.titulo,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        ubicacion: req.body.ubicacion,
        presupuesto: req.body.presupuesto,
        userId: req.body.userId || null,
        estado: "activo",
      });

      return res.status(201).json({ ok: true, servicio: nuevo });
    } catch (error) {
      console.error("❌ Error crear servicio:", error);
      return res.status(500).json({ error: "Error creando el servicio" });
    }
  },

  // =====================================================
  // 📄 LISTAR SERVICIOS
  // GET /api/servicios
  // GET /api/servicios?userId=123
  // =====================================================
  async listar(req, res) {
    try {
      const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const userId = req.query.userId ? Number(req.query.userId) : null;

      // 🔹 MIS SERVICIOS (con postulaciones)
      if (userId) {
        const servicios = await Servicio.findAll({
          where: {
            userId,
            estado: "activo",
            createdAt: { [Op.gte]: hace24h },
          },
          include: [
            {
              model: Postulacion,
              as: "postulaciones",
              required: false,
              include: [
                {
                  model: User,
                  as: "postulante",
                  attributes: ["id", "nombre", "email"],
                },
              ],
            },
          ],
          order: [
            ["id", "DESC"],
            [{ model: Postulacion, as: "postulaciones" }, "createdAt", "DESC"],
          ],
        });

        return res.json(servicios);
      }

      // 🔹 FEED GENERAL
      const servicios = await Servicio.findAll({
        where: {
          estado: "activo",
          createdAt: { [Op.gte]: hace24h },
        },
        order: [["id", "DESC"]],
      });

      return res.json(servicios);
    } catch (error) {
      console.error("❌ Error listar servicios:", error);
      return res.status(500).json({ error: "Error listando servicios" });
    }
  },

  // =====================================================
  // 📄 LISTAR MIS SERVICIOS (COMPATIBILIDAD)
  // GET /api/servicios/mis/:userId
  // =====================================================
  async listarMisServicios(req, res) {
    try {
      const { userId } = req.params;
      const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const servicios = await Servicio.findAll({
        where: {
          userId: Number(userId),
          estado: "activo",
          createdAt: { [Op.gte]: hace24h },
        },
        include: [
          {
            model: Postulacion,
            as: "postulaciones",
            required: false,
            include: [
              {
                model: User,
                as: "postulante",
                attributes: ["id", "nombre", "email"],
              },
            ],
          },
        ],
        order: [
          ["id", "DESC"],
          [{ model: Postulacion, as: "postulaciones" }, "createdAt", "DESC"],
        ],
      });

      return res.json(servicios);
    } catch (error) {
      console.error("❌ Error listarMisServicios:", error);
      return res.status(500).json({ error: "Error listando mis servicios" });
    }
  },

  // =====================================================
  // 📨 CREAR POSTULACIÓN
  // POST /api/servicios/:servicioId/postulaciones
  // =====================================================
  async crearPostulacionServicio(req, res) {
    try {
      const servicioId = Number(req.params.servicioId);
      const userId = Number(req.body.userId);
      const { mensaje } = req.body;

      if (!servicioId || !userId) {
        return res.status(400).json({
          error: "servicioId y userId son obligatorios",
        });
      }

      // ✅ IMPORTANTE: Number(servicioId) para evitar string
      const servicio = await Servicio.findByPk(servicioId);
      if (!servicio) {
        return res.status(404).json({ error: "Servicio no existe" });
      }

      // ✅ IMPORTANTE: Number(...) para evitar string
      const existe = await Postulacion.findOne({
        where: { servicioId, userId },
      });

      if (existe) {
        return res.status(400).json({
          error: "Ya postulaste a este servicio",
        });
      }

      const postulante = await User.findByPk(userId);
      if (!postulante) {
        return res.status(404).json({
          error: "Usuario postulante no existe",
        });
      }

      const nueva = await Postulacion.create({
        servicioId,
        userId,
        mensaje: mensaje || "",
        estado: "pendiente",
      });

      // 🔔 Notificar al dueño del servicio
      if (servicio.userId) {
        await crearNotificacion(
          servicio.userId,
          "Nueva postulación a tu servicio",
          `${postulante.nombre || "Un usuario"} se postuló a tu servicio "${servicio.titulo}".`
        );
      }

      return res.status(201).json({ ok: true, postulacion: nueva });
    } catch (error) {
      console.error("❌ Error crear postulación:", error);
      return res.status(500).json({ error: "Error al crear postulación" });
    }
  },

  // =====================================================
  // 🔁 CAMBIAR ESTADO POSTULACIÓN
  // PATCH | PUT /api/servicios/postulaciones/:id/estado
  // =====================================================
  async cambiarEstadoPostulacionServicio(req, res) {
    try {
      const id = Number(req.params.id);
      const { estado } = req.body;

      const estadosValidos = ["pendiente", "aceptado", "rechazado"];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({ error: "Estado inválido" });
      }

      const post = await Postulacion.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: "Postulación no encontrada" });
      }

      post.estado = estado;
      await post.save();

      // 🔔 Notificar al postulante
      await crearNotificacion(
        post.userId,
        "Estado de tu postulación",
        `Tu postulación fue ${estado}.`
      );

      return res.json({ ok: true, postulacion: post });
    } catch (error) {
      console.error("❌ Error cambiar estado:", error);
      return res.status(500).json({ error: "Error al cambiar estado" });
    }
  },

  // =====================================================
  // ✏ EDITAR SERVICIO
  // PUT /api/servicios/:id
  // =====================================================
  async editar(req, res) {
    try {
      const id = Number(req.params.id);

      const servicio = await Servicio.findOne({
        where: { id, estado: "activo" },
      });

      if (!servicio) {
        return res.status(404).json({
          error: "Servicio no encontrado o expirado",
        });
      }

      await servicio.update({
        titulo: req.body.titulo,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        ubicacion: req.body.ubicacion,
        presupuesto: req.body.presupuesto,
      });

      return res.json({ ok: true, servicio });
    } catch (error) {
      console.error("❌ Error editar servicio:", error);
      return res.status(500).json({ error: "Error editando servicio" });
    }
  },

  // =====================================================
  // ❌ ELIMINAR SERVICIO
  // DELETE /api/servicios/:id
  // =====================================================
  async eliminar(req, res) {
    try {
      const id = Number(req.params.id);

      const servicio = await Servicio.findByPk(id);
      if (!servicio) {
        return res.status(404).json({
          error: "Servicio no encontrado",
        });
      }

      await servicio.destroy();

      return res.json({
        ok: true,
        mensaje: "Servicio eliminado",
      });
    } catch (error) {
      console.error("❌ Error eliminar servicio:", error);
      return res.status(500).json({ error: "Error eliminando servicio" });
    }
  },

  // =====================================================
  // 🧪 DEBUG: VER IDS DISPONIBLES (últimos 30)
  // GET /api/servicios/debug/ids
  // =====================================================
  async debugIds(req, res) {
    try {
      const servicios = await Servicio.findAll({
        attributes: ["id", "titulo", "estado", "createdAt", "userId"],
        order: [["id", "DESC"]],
        limit: 30,
      });

      return res.json({ total: servicios.length, servicios });
    } catch (error) {
      console.error("❌ debugIds:", error);
      return res.status(500).json({ error: "Error debugIds" });
    }
  },

  // =====================================================
  // 🧪 DEBUG: VER SERVICIO POR ID
  // GET /api/servicios/debug/:id
  // =====================================================
  async debugById(req, res) {
    try {
      const id = Number(req.params.id);

      const servicio = await Servicio.findByPk(id);
      if (!servicio) {
        return res.status(404).json({ error: "Servicio no existe" });
      }

      return res.json({ servicio });
    } catch (error) {
      console.error("❌ debugById:", error);
      return res.status(500).json({ error: "Error debugById" });
    }
  },
};
