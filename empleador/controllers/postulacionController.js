"use strict";

// 👈 IMPORTA SIEMPRE DESDE ../../models (subes 2 carpetas: .. = controllers → empleador, .. = empleador → raíz)
const db = require("../../models");
const { Postulacion, User } = db;

module.exports = {
  // ======================================================
  // 🔹 Crear postulación
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

      const nueva = await Postulacion.create({
        trabajoId,
        userId,
        mensaje: mensaje || "",
        estado: "pendiente",
      });

      return res.status(201).json({
        postulacion: nueva,
      });
    } catch (err) {
      console.error("❌ Error al crear postulación:", err);
      return res.status(500).json({
        error: "Error al crear postulación",
      });
    }
  },

  // ======================================================
  // 🔹 Listar postulaciones de un trabajo
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

      return res.json({ postulaciones: lista });
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

      return res.json({ postulacion: post });
    } catch (err) {
      console.error("❌ Error al cambiar estado:", err);
      return res.status(500).json({
        error: "Error al cambiar estado",
      });
    }
  },
};
