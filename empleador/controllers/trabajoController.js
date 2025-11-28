"use strict";

const { Trabajo, User, Empleador } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  // ======================================================
  // 🔹 Crear trabajo
  // ======================================================
  async crear(req, res) {
    try {
      const { titulo, descripcion, salario, ubicacion, categoria, empleadorId } =
        req.body;

      if (!titulo || !descripcion || !empleadorId) {
        return res.status(400).json({
          error: "titulo, descripcion y empleadorId son obligatorios",
        });
      }

      // Confirmar que empleador existe
      const empleador = await Empleador.findByPk(empleadorId);
      if (!empleador) {
        return res.status(400).json({ error: "El empleador no existe" });
      }

      const nuevo = await Trabajo.create({
        titulo,
        descripcion,
        salario: salario || "",
        ubicacion: ubicacion || "",
        categoria: categoria || "",
        estado: "activo",
        empleadorId,
      });

      return res.status(201).json({
        message: "Trabajo creado correctamente",
        trabajo: nuevo,
      });
    } catch (error) {
      console.error("❌ Error al crear trabajo:", error);
      return res.status(500).json({ error: "Error al crear trabajo" });
    }
  },

  // ======================================================
  // 🔹 Listar trabajos con filtros
  // ======================================================
  async listar(req, res) {
    try {
      const { estado, categoria, buscar } = req.query;

      const where = {};

      if (estado) where.estado = estado;
      if (categoria) where.categoria = categoria;

      if (buscar) {
        where[Op.or] = [
          { titulo: { [Op.iLike]: `%${buscar}%` } },
          { descripcion: { [Op.iLike]: `%${buscar}%` } },
        ];
      }

      const trabajos = await Trabajo.findAll({
        where,
        order: [["createdAt", "DESC"]],
      });

      return res.json({ trabajos });
    } catch (error) {
      console.error("❌ Error al listar trabajos:", error);
      return res.status(500).json({ error: "Error al listar trabajos" });
    }
  },

  // ======================================================
  // 🔹 Listar trabajos del empleador (ARREGLADO)
  // ======================================================
  async listarPorEmpleador(req, res) {
    try {
      const { empleadorId } = req.params;

      const trabajos = await Trabajo.findAll({
        where: { empleadorId },
        order: [["createdAt", "DESC"]],
      });

      return res.json({ trabajos });
    } catch (error) {
      console.error("❌ Error listarPorEmpleador:", error);
      return res
        .status(500)
        .json({ error: "Error al listar trabajos por empleador" });
    }
  },

  // ======================================================
  // 🔹 Obtener un trabajo
  // ======================================================
  async obtenerUno(req, res) {
    try {
      const { id } = req.params;
      const trabajo = await Trabajo.findByPk(id);

      if (!trabajo) {
        return res.status(404).json({ error: "Trabajo no encontrado" });
      }

      return res.json({ trabajo });
    } catch (error) {
      console.error("❌ Error al obtener trabajo:", error);
      return res.status(500).json({ error: "Error al obtener trabajo" });
    }
  },

  // ======================================================
  // 🔹 Actualizar trabajo
  // ======================================================
  async actualizar(req, res) {
    try {
      const { id } = req.params;

      const trabajo = await Trabajo.findByPk(id);
      if (!trabajo) {
        return res.status(404).json({ error: "Trabajo no encontrado" });
      }

      await trabajo.update(req.body);

      return res.json({
        message: "Trabajo actualizado correctamente",
        trabajo,
      });
    } catch (error) {
      console.error("❌ Error al actualizar trabajo:", error);
      return res.status(500).json({ error: "Error al actualizar trabajo" });
    }
  },

  // ======================================================
  // 🔹 Cambiar estado
  // ======================================================
  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({ error: "estado es requerido" });
      }

      const trabajo = await Trabajo.findByPk(id);
      if (!trabajo) {
        return res.status(404).json({ error: "Trabajo no encontrado" });
      }

      trabajo.estado = estado;
      await trabajo.save();

      return res.json({
        message: "Estado actualizado",
        trabajo,
      });
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      return res.status(500).json({ error: "Error al cambiar estado" });
    }
  },

  // ======================================================
  // 🔹 Eliminar trabajo
  // ======================================================
  async eliminar(req, res) {
    try {
      const { id } = req.params;

      const trabajo = await Trabajo.findByPk(id);
      if (!trabajo) {
        return res.status(404).json({ error: "Trabajo no encontrado" });
      }

      await trabajo.destroy();

      return res.json({ message: "Trabajo eliminado correctamente" });
    } catch (error) {
      console.error("❌ Error al eliminar trabajo:", error);
      return res.status(500).json({ error: "Error al eliminar trabajo" });
    }
  },
};
