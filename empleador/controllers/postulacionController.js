"use strict";

const db = require("../../models");
const { Postulacion, User, Trabajo, Empleador } = db;
const { crearNotificacion } = require("../../methods/notificar");

module.exports = {
  // ======================================================
  // 🔹 Crear postulación (TRABAJADOR → EMPLEADOR)
  // ======================================================
  async crear(req, res) {
    try {
      const { trabajoId, userId, mensaje } = req.body;

      if (!trabajoId || !userId) {
        return res.status(400).json({
          error: "trabajoId y userId son obligatorios",
        });
      }

      // Evitar postulaciones duplicadas
      const existe = await Postulacion.findOne({
        where: { trabajoId, userId },
      });

      if (existe) {
        return res.status(400).json({
          error: "Ya postulaste a este trabajo",
        });
      }

      // Validar que el trabajo exista
      const trabajo = await Trabajo.findByPk(trabajoId);
      if (!trabajo) {
        return res.status(404).json({
          error: "El trabajo no existe",
        });
      }

      // Validar empleador
      if (!trabajo.empleadorId) {
        return res.status(400).json({
          error: "Este trabajo no tiene empleador asignado",
        });
      }

      const empleador = await Empleador.findByPk(trabajo.empleadorId);
      if (!empleador) {
        return res.status(404).json({
          error: "El empleador no existe",
        });
      }

      // Datos del postulante
      const postulanteUser = await User.findByPk(userId);
      if (!postulanteUser) {
        return res.status(404).json({
          error: "El usuario postulante no existe",
        });
      }

      // Crear postulación
      const nueva = await Postulacion.create({
        trabajoId,
        userId,
        mensaje: mensaje || "",
        estado: "pendiente",
      });

      // 🔔 NOTIFICACIÓN (FORMA CORRECTA – SOLO 3 STRINGS)
      await crearNotificacion(
        empleador.userId,
        "Nueva postulación recibida",
        `El trabajador ${postulanteUser.nombre || "Trabajador"} se postuló al trabajo "${trabajo.titulo}".`
      );

      return res.status(201).json({
        ok: true,
        postulacion: nueva,
      });

    } catch (error) {
      console.error("❌ Error al crear postulación:", error);
      return res.status(500).json({
        error: "Error al crear postulación",
      });
    }
  },

  // ======================================================
  // 🔹 Listar postulaciones de un trabajo (EMPLEADOR)
  // ======================================================
  async porTrabajo(req, res) {
    try {
      const { trabajoId } = req.params;

      const lista = await Postulacion.findAll({
        where: { trabajoId },
        include: [
          {
            model: User,
            as: "postulante",
            attributes: ["id", "nombre", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      const postulaciones = lista.map((p) => ({
        id: p.id,
        estado: p.estado,
        mensaje: p.mensaje,
        createdAt: p.createdAt,
        postulante: {
          userId: p.postulante.id,
          nombre: p.postulante.nombre,
          email: p.postulante.email,
        },
      }));

      return res.json({ postulaciones });

    } catch (error) {
      console.error("❌ Error al listar postulaciones:", error);
      return res.status(500).json({
        error: "Error al obtener postulaciones",
      });
    }
  },

  // ======================================================
  // 🔹 Listar postulaciones por usuario (TRABAJADOR)
  // ======================================================
  async porUsuario(req, res) {
    try {
      const { userId } = req.params;

      const postulaciones = await Postulacion.findAll({
        where: { userId },
        include: [
          {
            model: Trabajo,
            as: "trabajo",
            attributes: ["id", "titulo", "estado", "createdAt"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.json({ postulaciones });

    } catch (error) {
      console.error("❌ Error al listar postulaciones del usuario:", error);
      return res.status(500).json({
        error: "Error al obtener postulaciones del usuario",
      });
    }
  },

  // ======================================================
  // 🔹 Cambiar estado de postulación (EMPLEADOR)
  // ======================================================
  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const estadosValidos = ["pendiente", "aceptado", "rechazado"];
      if (!estadosValidos.includes(estado)) {
        return res.status(400).json({
          error: "Estado inválido",
        });
      }

      const post = await Postulacion.findByPk(id);
      if (!post) {
        return res.status(404).json({
          error: "Postulación no encontrada",
        });
      }

      post.estado = estado;
      await post.save();

      // 🔔 Notificar al trabajador
      await crearNotificacion(
        post.userId,
        "Estado de tu postulación",
        `Tu postulación fue ${estado}.`
      );

      return res.json({
        ok: true,
        postulacion: post,
      });

    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      return res.status(500).json({
        error: "Error al cambiar estado",
      });
    }
  },
};
