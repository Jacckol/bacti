"use strict";

const { Trabajo, Empleador, User } = require("../../models");
const { Op } = require("sequelize");

module.exports = {
  // ======================================================
  // 🔹 Crear trabajo (OFERTA)
  // ======================================================
  async crear(req, res) {
    try {
      const {
        titulo,
        descripcion,
        salario,
        ubicacion,
        categoria,
        userId,
      } = req.body;

      if (!titulo || !descripcion || !userId) {
        return res.status(400).json({
          error: "titulo, descripcion y userId son obligatorios",
        });
      }

      const empleador = await Empleador.findOne({ where: { userId } });

      if (!empleador) {
        return res.status(400).json({
          error: "No existe un empleador asociado a ese usuario",
        });
      }

      const nuevo = await Trabajo.create({
        titulo,
        descripcion,
        salario: salario ? salario.toString() : "",
        ubicacion: ubicacion || "",
        categoria: categoria || "",
        estado: "activo",
        empleadorId: empleador.id,
      });

      return res.status(201).json({
        message: "Trabajo creado correctamente",
        trabajo: nuevo,
      });
    } catch (error) {
      console.error("❌ Error al crear trabajo:", error);
      return res.status(500).json({
        error: "Error al crear trabajo",
        detail: error.message,
      });
    }
  },

  // ======================================================
  // 🔹 Listar trabajos (para TRABAJADORES)
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
        include: [
          {
            model: Empleador,
            as: "empleador",
            attributes: ["id", "nombre", "telefono", "direccion"],
            include: [
              {
                model: User,
                as: "usuario",
                attributes: ["id", "nombre", "email"]
              }
            ]
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.json(trabajos);
    } catch (error) {
      console.error("❌ Error al listar trabajos:", error);
      return res.status(500).json({ error: "Error al listar trabajos" });
    }
  },

  // ======================================================
  // 🔹 Listar trabajos del empleador (MIS PUBLICACIONES)
  // ======================================================
  async listarPorEmpleador(req, res) {
    try {
      const { userId } = req.params;

      const empleador = await Empleador.findOne({ where: { userId } });

      if (!empleador) {
        return res.json({ trabajos: [] });
      }

      const trabajos = await Trabajo.findAll({
        where: { empleadorId: empleador.id },
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
  // 🔹 Obtener un trabajo por ID
  // ======================================================
  async obtenerUno(req, res) {
    try {
      const { id } = req.params;

      const trabajo = await Trabajo.findByPk(id, {
        include: [
          {
            model: Empleador,
            as: "empleador",
            attributes: ["id", "nombre", "telefono", "direccion"],
            include: [
              {
                model: User,
                as: "usuario",
                attributes: ["id", "nombre", "email"]
              }
            ]
          },
        ],
      });

      if (!trabajo) {
        return res.status(404).json({ error: "Trabajo no encontrado" });
      }

      return res.json(trabajo);
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
