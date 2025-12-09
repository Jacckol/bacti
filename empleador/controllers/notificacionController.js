const { Notificacion } = require("../../models");

// Crear notificación manual (opcional)
exports.crearNotificacionManual = async (req, res) => {
  try {
    const { userId, titulo, mensaje } = req.body;

    const nueva = await Notificacion.create({
      userId,
      titulo,
      mensaje,
      leido: false
    });

    return res.json(nueva);

  } catch (error) {
    console.error("Error crearNotificacionManual:", error);
    return res.status(500).json({ message: "Error creando notificación" });
  }
};

// Obtener notificaciones por usuario
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

// Marcar como leída
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
