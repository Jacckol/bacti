"use strict";

const {
  Trabajo,
  Empleador,
  User,
  Trabajador,
  Notificacion,
  SolicitudTrabajo,
} = require("../../models");
const { Op } = require("sequelize");
const { crearNotificacion } = require("../../methods/notificar");

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

      // 🔔 Notificar a todos los trabajadores
      try {
        const trabajadores = await Trabajador.findAll({
          attributes: ["userId"],
        });

        for (const t of trabajadores) {
          await crearNotificacion(t.userId, {
            titulo: "Nuevo trabajo disponible",
            mensaje: `Se publicó un nuevo trabajo: "${titulo}".`,
            trabajoId: nuevo.id,
          });
        }
      } catch (err) {
        console.log("⚠ Error creando notificaciones:", err);
      }

      return res.status(201).json({
        message: "Trabajo creado correctamente",
        trabajo: nuevo,
      });
    } catch (error) {
      console.error("❌ Error al crear trabajo:", error);
      return res.status(500).json({
        error: "Error al crear trabajo",
      });
    }
  },

  // ======================================================
  // 🔹 Obtener TODOS los trabajos con filtros
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
            include: [
              {
                model: User,
                as: "usuarioEmpleador",
                attributes: ["id", "nombre", "email"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      res.json(trabajos);
    } catch (error) {
      console.error("❌ Error al listar trabajos:", error);
      res.status(500).json({ error: "Error al listar trabajos" });
    }
  },

  // ======================================================
  // 🔹 Listar trabajos de un empleador
  // ======================================================
  async listarPorEmpleador(req, res) {
    try {
      const { userId } = req.params;

      const empleador = await Empleador.findOne({ where: { userId } });
      if (!empleador) return res.json({ trabajos: [] });

      const trabajos = await Trabajo.findAll({
        where: { empleadorId: empleador.id },
        order: [["createdAt", "DESC"]],
      });

      res.json({ trabajos });
    } catch (error) {
      console.error("❌ Error al listar trabajos del empleador:", error);
      res.status(500).json({ error: "Error al listar trabajos del empleador" });
    }
  },

  // ======================================================
  // 🔹 Obtener trabajo por ID
  // ======================================================
  async obtenerUno(req, res) {
    try {
      const { id } = req.params;

      const trabajo = await Trabajo.findByPk(id, {
        include: [
          {
            model: Empleador,
            as: "empleador",
            include: [
              {
                model: User,
                as: "usuarioEmpleador",
                attributes: ["id", "nombre", "email"],
              },
            ],
          },
        ],
      });

      if (!trabajo) {
        return res.status(404).json({ error: "Trabajo no encontrado" });
      }

      res.json(trabajo);
    } catch (error) {
      console.error("❌ Error al obtener trabajo:", error);
      res.status(500).json({ error: "Error al obtener trabajo" });
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

      res.json({
        message: "Trabajo actualizado correctamente",
        trabajo,
      });
    } catch (error) {
      console.error("❌ Error al actualizar trabajo:", error);
      res.status(500).json({ error: "Error al actualizar trabajo" });
    }
  },

  // ======================================================
  // 🔹 Cambiar estado del trabajo
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

      res.json({
        message: "Estado actualizado correctamente",
        trabajo,
      });
    } catch (error) {
      console.error("❌ Error al cambiar estado:", error);
      res.status(500).json({ error: "Error al cambiar estado" });
    }
  },

  // ======================================================
  // 🔥 FINALIZAR TRABAJO (TIPO inDrive)
  // ======================================================
  async finalizarTrabajo(req, res) {
    try {
      const { id } = req.params; // trabajoId
      const { resultado } = req.body; // exitoso | malo

      if (!["exitoso", "malo"].includes(resultado)) {
        return res.status(400).json({ error: "Resultado inválido" });
      }

      const trabajo = await Trabajo.findByPk(id);
      if (!trabajo) {
        return res.status(404).json({ error: "Trabajo no encontrado" });
      }

      trabajo.estado = "finalizado";
      trabajo.resultado = resultado;
      await trabajo.save();

      const solicitud = await SolicitudTrabajo.findOne({
        where: {
          trabajoId: id,
          estado: "aceptada",
        },
      });

      if (solicitud) {
        await crearNotificacion(solicitud.userId, {
          titulo:
            resultado === "exitoso"
              ? "Trabajo finalizado con éxito"
              : "Trabajo con inconvenientes",
          mensaje:
            resultado === "exitoso"
              ? `El trabajo "${trabajo.titulo}" fue finalizado correctamente.`
              : `El empleador reportó problemas en el trabajo "${trabajo.titulo}".`,
          trabajoId: trabajo.id,
          empleadorId: trabajo.empleadorId,
        });
      }

      return res.json({
        message: "Trabajo finalizado correctamente",
        trabajo,
      });
    } catch (error) {
      console.error("❌ Error al finalizar trabajo:", error);
      res.status(500).json({ error: "Error al finalizar trabajo" });
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
      res.json({ message: "Trabajo eliminado correctamente" });
    } catch (error) {
      console.error("❌ Error al eliminar trabajo:", error);
      res.status(500).json({ error: "Error al eliminar trabajo" });
    }
  },
};
