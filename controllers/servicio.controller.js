const { Servicio } = require("../models");

module.exports = {
  // ---------------------------------------------------
  // 🔹 CREAR SERVICIO
  // ---------------------------------------------------
  async crear(req, res) {
    try {
      const nuevo = await Servicio.create({
        titulo: req.body.titulo,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        ubicacion: req.body.ubicacion,
        presupuesto: req.body.presupuesto,
        userId: req.body.userId || null
      });

      res.json({ ok: true, servicio: nuevo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creando el servicio" });
    }
  },

  // ---------------------------------------------------
  // 🔹 LISTAR SERVICIOS
  // ---------------------------------------------------
  async listar(req, res) {
    try {
      const servicios = await Servicio.findAll({
        order: [["id", "DESC"]],
      });

      res.json(servicios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error listando servicios" });
    }
  },

  // ---------------------------------------------------
  // 🔹 EDITAR SERVICIO
  // ---------------------------------------------------
  async editar(req, res) {
    try {
      const { id } = req.params;

      const servicio = await Servicio.findByPk(id);
      if (!servicio) {
        return res.status(404).json({ error: "Servicio no encontrado" });
      }

      await servicio.update({
        titulo: req.body.titulo,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        ubicacion: req.body.ubicacion,
        presupuesto: req.body.presupuesto,
      });

      res.json({ ok: true, servicio });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error editando servicio" });
    }
  },

  // ---------------------------------------------------
  // 🔹 ELIMINAR SERVICIO
  // ---------------------------------------------------
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const servicio = await Servicio.findByPk(id);
      if (!servicio) {
        return res.status(404).json({ error: "Servicio no encontrado" });
      }

      await servicio.destroy();

      res.json({ ok: true, mensaje: "Servicio eliminado" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error eliminando servicio" });
    }
  },
};
