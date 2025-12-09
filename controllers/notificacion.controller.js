const { Notificacion } = require("../models");

exports.getNotificacionesUsuario = async (req, res) => {
  try {
    const { userId } = req.params;

    const notificaciones = await Notificacion.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json(notificaciones);
  } catch (error) {
    console.error("Error getNotificacionesUsuario:", error);
    return res.status(500).json({ message: "Error al obtener notificaciones" });
  }
};

exports.marcarNotificacionLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByPk(id);
    if (!notificacion) {
      return res.status(404).json({ message: "Notificación no encontrada" });
    }

    notificacion.leido = true;
    await notificacion.save();

    return res.json({ ok: true, notificacion });
  } catch (error) {
    console.error("Error marcarNotificacionLeida:", error);
    return res.status(500).json({ message: "Error al marcar como leída" });
  }
};
