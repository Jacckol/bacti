const { SolicitudTrabajo, Trabajo } = require("../models");

module.exports = {
  // Crear solicitud (postular)
  async crear(req, res) {
    try {
      const { trabajoId, userId, mensaje } = req.body;

      if (!trabajoId || !userId) {
        return res.status(400).json({ error: "Faltan datos" });
      }

      // Ver si ya existe
      const existe = await SolicitudTrabajo.findOne({
        where: { trabajoId, userId },
      });

      if (existe) {
        return res.status(400).json({ error: "Ya estás postulado" });
      }

      const nueva = await SolicitudTrabajo.create({
        trabajoId,
        userId,
        mensaje: mensaje || "",
        estado: "pendiente",
      });

      return res.json(nueva);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Error al crear solicitud" });
    }
  },

  // Obtener mis solicitudes
  async listarMisSolicitudes(req, res) {
    try {
      const { userId } = req.params;

      const solicitudes = await SolicitudTrabajo.findAll({
        where: { userId },
        include: [
          {
            model: Trabajo,
            as: "trabajo",
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.json(solicitudes);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Error al obtener solicitudes" });
    }
  },

  // ACEPTAR solicitud (empleador)
  async aceptar(req, res) {
    try {
      const { id } = req.params;

      const solicitud = await SolicitudTrabajo.findByPk(id);
      if (!solicitud) return res.status(404).json({ error: "No existe" });

      solicitud.estado = "aceptada";
      await solicitud.save();

      return res.json({ mensaje: "Solicitud aceptada", solicitud });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Error al aceptar solicitud" });
    }
  },

  // RECHAZAR solicitud (empleador)
  async rechazar(req, res) {
    try {
      const { id } = req.params;

      const solicitud = await SolicitudTrabajo.findByPk(id);
      if (!solicitud) return res.status(404).json({ error: "No existe" });

      solicitud.estado = "rechazada";
      await solicitud.save();

      return res.json({ mensaje: "Solicitud rechazada", solicitud });
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: "Error al rechazar solicitud" });
    }
  },
};
