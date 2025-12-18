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

      // Evitar duplicadas
      const existe = await Postulacion.findOne({
        where: { trabajoId, userId },
      });

      if (existe) {
        return res.status(400).json({
          error: "Ya postulaste a este trabajo",
        });
      }

      // =============================
      // VALIDAR QUE EL TRABAJO EXISTA
      // =============================
      const trabajo = await Trabajo.findByPk(trabajoId);

      if (!trabajo) {
        return res.status(404).json({
          error: "El trabajo no existe",
        });
      }

      // =============================
      // VALIDAR QUE EL EMPLEADOR EXISTA
      // =============================
      if (!trabajo.empleadorId) {
        return res.status(400).json({
          error: "Este trabajo no tiene un empleador asignado",
        });
      }

      const empleador = await Empleador.findByPk(trabajo.empleadorId);

      if (!empleador) {
        return res.status(404).json({
          error: "El empleador no existe",
        });
      }

      // =============================
      // OBTENER DATOS DEL POSTULANTE
      // =============================
      const postulanteUser = await User.findByPk(userId);

      // =============================
      // CREAR LA POSTULACIÓN
      // =============================
      const nueva = await Postulacion.create({
        trabajoId,
        userId,
        mensaje: mensaje || "",
        estado: "pendiente",
      });

      // =============================
      // 🔔 NOTIFICAR AL EMPLEADOR
      // =============================
      await crearNotificacion(
        empleador.userId,
        "Nueva postulación recibida",
        `Un trabajador se ha postulado al trabajo: "${trabajo.titulo}".`,
        {
          postulante: {
            userId: postulanteUser.id,
            nombre: postulanteUser.nombre || "Trabajador",
          },
          trabajo: {
            id: trabajo.id,
            titulo: trabajo.titulo,
          },
        }
      );

      return res.status(201).json({ postulacion: nueva });

    } catch (err) {
      console.error("❌ Error al crear postulación:", err);
      return res.status(500).json({
        error: "Error al crear postulación",
      });
    }
  },

  // ======================================================
  // 🔹 Listar postulaciones de un trabajo (FIX DEFINITIVO)
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

      // 🔥 FIX REAL: ENVIAR userId EXPLÍCITO
      const postulaciones = lista.map((p) => ({
        id: p.id,
        estado: p.estado,
        mensaje: p.mensaje,
        createdAt: p.createdAt,
        postulante: {
          userId: p.postulante.id, // 🔥 ESTE ERA EL PROBLEMA
          nombre: p.postulante.nombre,
          email: p.postulante.email,
        },
      }));

      return res.json({ postulaciones });

    } catch (err) {
      console.error("❌ Error al listar postulaciones:", err);
      return res.status(500).json({
        error: "Error al obtener postulaciones",
      });
    }
  },

  // ======================================================
  // 🔹 Cambiar estado (pendiente / aceptado / rechazado)
  // ======================================================
  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      const validos = ["pendiente", "aceptado", "rechazado"];
      if (!validos.includes(estado)) {
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
        "Actualización de tu postulación",
        `Tu postulación fue ${estado}.`
      );

      return res.json({ postulacion: post });

    } catch (err) {
      console.error("❌ Error al cambiar estado:", err);
      return res.status(500).json({
        error: "Error al cambiar estado",
      });
    }
  },
};
