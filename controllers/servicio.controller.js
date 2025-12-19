const { Servicio } = require("../models");
const { Op } = require("sequelize");

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
        userId: req.body.userId || null,
        estado: "activo", // 🔥 IMPORTANTE
      });

      res.json({ ok: true, servicio: nuevo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creando el servicio" });
    }
  },

  // ---------------------------------------------------
  // 🔹 LISTAR SERVICIOS (ACTIVOS + < 24H)
  // ---------------------------------------------------
  async listar(req, res) {
    try {
      const hace24h = new Date(
        Date.now() - 24 * 60 * 60 * 1000
      );

      const servicios = await Servicio.findAll({
        where: {
          estado: "activo",
          createdAt: {
            [Op.gte]: hace24h,
          },
        },
        order: [["id", "DESC"]],
      });

      res.json(servicios);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error listando servicios" });
    }
  },

  // ---------------------------------------------------
  // 🔹 EDITAR SERVICIO (SOLO SI ESTÁ ACTIVO)
  // ---------------------------------------------------
  async editar(req, res) {
    try {
      const { id } = req.params;

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
