const { User, Empleador } = require('../models');

module.exports = {
  // =====================================================
  // OBTENER DATOS DEL EMPLEADOR POR userId
  // =====================================================
  async obtenerPorUser(req, res) {
    try {
      const { userId } = req.params;

      const empleador = await Empleador.findOne({
        where: { userId },
        include: [
          { model: User, as: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] }
        ]
      });

      if (!empleador) {
        return res.status(404).json({ error: "El empleador no existe." });
      }

      res.json(empleador);
    } catch (error) {
      console.error("Error obtener empleador:", error);
      res.status(500).json({ error: "Error interno al obtener el empleador." });
    }
  },

  // =====================================================
  // CREAR EMPLEADOR (solo si no existe)
  // =====================================================
  async crear(req, res) {
    try {
      const { empresa, ruc, telefono, userId } = req.body;

      if (!empresa || !ruc || !telefono || !userId) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
      }

      // Verificar si ya tiene registro de empleador
      const existe = await Empleador.findOne({ where: { userId } });
      if (existe) {
        return res.status(400).json({ error: "El usuario ya tiene un perfil de empleador." });
      }

      const empleador = await Empleador.create({
        empresa,
        ruc,
        telefono,
        userId
      });

      res.status(201).json({ mensaje: "Empleador creado correctamente", empleador });
    } catch (error) {
      console.error("Error crear empleador:", error);
      res.status(500).json({ error: "Error interno al crear empleador." });
    }
  },

  // =====================================================
  // ACTUALIZAR EMPLEADOR
  // =====================================================
  async actualizar(req, res) {
    try {
      const { userId } = req.params;
      const datos = req.body;

      const empleador = await Empleador.findOne({ where: { userId } });

      if (!empleador) {
        return res.status(404).json({ error: "El empleador no existe." });
      }

      await empleador.update(datos);

      res.json({
        mensaje: "Empleador actualizado correctamente",
        empleador
      });
    } catch (error) {
      console.error("Error actualizar empleador:", error);
      res.status(500).json({ error: "Error interno al actualizar empleador." });
    }
  },

  // =====================================================
  // ELIMINAR PERFIL EMPLEADOR (solo los datos, no el usuario)
  // =====================================================
  async eliminar(req, res) {
    try {
      const { userId } = req.params;

      const empleador = await Empleador.findOne({ where: { userId } });

      if (!empleador) {
        return res.status(404).json({ error: "El empleador no existe." });
      }

      await empleador.destroy();

      res.json({ mensaje: "Perfil de empleador eliminado correctamente." });
    } catch (error) {
      console.error("Error eliminar empleador:", error);
      res.status(500).json({ error: "Error interno al eliminar el empleador." });
    }
  },

  // =====================================================
  // LISTAR TODOS LOS EMPLEADORES
  // =====================================================
  async listar(req, res) {
    try {
      const empleadores = await Empleador.findAll({
        include: [
          { model: User, as: 'usuario', attributes: ['id', 'nombre', 'email', 'rol'] }
        ]
      });

      res.json(empleadores);
    } catch (error) {
      console.error("Error listar empleadores:", error);
      res.status(500).json({ error: "Error interno al listar empleadores." });
    }
  }
};
