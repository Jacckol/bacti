const { Notificacion } = require("../../models");

module.exports = {
  // ======================================================
  //  🔹 Crear notificación
  // ======================================================
  async crear(req, res) {
    try {
      const { userId, titulo, mensaje } = req.body;

      if (!userId || !titulo || !mensaje) {
        return res.status(400).json({
          error: "userId, titulo y mensaje son obligatorios",
        });
      }

      const n = await Notificacion.create({
        userId,
        titulo,
        mensaje,
      });

      return res.status(201).json({ notificacion: n });
    } catch (error) {
      console.error("❌ Error al crear notificación:", error);
      return res.status(500).json({ error: "Error al crear notificación" });
    }
  },

  // ======================================================
  //  🔹 Listar notificaciones por usuario
  // ======================================================
  async listarPorUsuario(req, res) {
    try {
      const { userId } = req.params;

      const notificaciones = await Notificacion.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      return res.json({ notificaciones });
    } catch (error) {
      console.error("❌ Error al listar notificaciones:", error);
      return res
        .status(500)
        .json({ error: "Error al listar notificaciones" });
    }
  },

  // ======================================================
  //  🔹 Marcar como leído
  // ======================================================
  async marcarLeido(req, res) {
    try {
      const { id } = req.params;

      const n = await Notificacion.findByPk(id);
      if (!n) {
        return res.status(404).json({ error: "Notificación no encontrada" });
      }

      n.leido = true;
      await n.save();

      return res.json({ notificacion: n });
    } catch (error) {
      console.error("❌ Error al marcar notificación:", error);
      return res
        .status(500)
        .json({ error: "Error al marcar como leída" });
    }
  },
};
