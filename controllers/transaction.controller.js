"use strict";

const {
  Transaction,
  Trabajo,
  User,
} = require("../models");

module.exports = {

  // ======================================================
  // 🔥 EMPLEADOR PAGA → TRABAJADOR RECIBE (PAGO POR TRABAJO)
  // ======================================================
  async crear(req, res) {
    try {
      const {
        empleadorId,   // 👉 USER ID del empleador
        trabajadorId,  // 👉 USER ID del trabajador
        monto,
        descripcion,
        servicioId,
        trabajoId,
      } = req.body;

      // =============================
      // 🔒 VALIDACIONES BÁSICAS
      // =============================
      if (!empleadorId || !trabajadorId || !monto) {
        return res.status(400).json({
          error: "empleadorId, trabajadorId y monto son obligatorios",
        });
      }

      if (monto <= 0) {
        return res.status(400).json({
          error: "El monto debe ser mayor a 0",
        });
      }

      // =============================
      // 🔎 VALIDAR TRABAJO
      // =============================
      if (trabajoId) {
        const trabajo = await Trabajo.findByPk(trabajoId);

        if (!trabajo) {
          return res.status(400).json({
            error: "El trabajo no existe",
          });
        }

        if (trabajo.estado !== "finalizado") {
          return res.status(400).json({
            error: "El trabajo aún no está finalizado",
          });
        }
      }

      // ======================================================
      // ✅ VALIDAR EMPLEADOR (USER)
      // ======================================================
      const empleadorUser = await User.findByPk(empleadorId);
      if (!empleadorUser) {
        return res.status(400).json({
          error: "El empleador no existe",
        });
      }

      // ======================================================
      // ✅ VALIDAR TRABAJADOR (USER)
      // ======================================================
      const trabajadorUser = await User.findByPk(trabajadorId);
      if (!trabajadorUser) {
        return res.status(400).json({
          error: "El trabajador no existe",
        });
      }

      // =============================
      // 1️⃣ GASTO DEL EMPLEADOR
      // =============================
      const gasto = await Transaction.create({
        userId: empleadorUser.id,
        origenUserId: empleadorUser.id,
        destinoUserId: trabajadorUser.id,
        monto,
        tipo: "gasto",
        descripcion: descripcion || "Pago por trabajo",
        servicioId: servicioId || null,
        trabajoId: trabajoId || null,
        estado: "pagado",
      });

      // =============================
      // 2️⃣ INGRESO DEL TRABAJADOR
      // =============================
      const ingreso = await Transaction.create({
        userId: trabajadorUser.id,
        origenUserId: empleadorUser.id,
        destinoUserId: trabajadorUser.id,
        monto,
        tipo: "ingreso",
        descripcion: "Pago recibido por trabajo",
        servicioId: servicioId || null,
        trabajoId: trabajoId || null,
        estado: "pagado",
      });

      return res.json({
        ok: true,
        gasto,
        ingreso,
      });

    } catch (error) {
      console.error("❌ Error al crear pago:", error);
      return res.status(500).json({
        error: "Error al procesar el pago",
      });
    }
  },

  // ======================================================
  // 💳 RECARGA PAYPAL SIMULADA
  // ======================================================
  async recarga(req, res) {
    try {
      const { monto, descripcion } = req.body;
      const userId = req.user.id; // ✅ USER ID

      if (!monto || monto <= 0) {
        return res.status(400).json({
          error: "monto válido es obligatorio",
        });
      }

      const transaccion = await Transaction.create({
        userId,
        origenUserId: userId,
        destinoUserId: userId,
        monto,
        tipo: "gasto",
        descripcion: descripcion || "Recarga PayPal (simulada)",
        estado: "pagado",
      });

      return res.json({
        ok: true,
        transaccion,
      });

    } catch (error) {
      console.error("❌ Error en recarga:", error);
      return res.status(500).json({
        error: "Error al procesar recarga",
      });
    }
  },

  // ======================================================
  // 🔹 MIS TRANSACCIONES
  // ======================================================
  async misTransacciones(req, res) {
    try {
      const userId = req.user.id;

      const transacciones = await Transaction.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]],
      });

      return res.json(transacciones);

    } catch (error) {
      console.error("❌ Error al obtener transacciones:", error);
      return res.status(500).json({
        error: "Error al obtener transacciones",
      });
    }
  },

  // ======================================================
  // 🔹 HISTORIAL TOTAL (ADMIN / DEBUG)
  // ======================================================
  async todas(req, res) {
    try {
      const transacciones = await Transaction.findAll({
        order: [["createdAt", "DESC"]],
      });

      return res.json(transacciones);

    } catch (error) {
      console.error("❌ Error al obtener historial:", error);
      return res.status(500).json({
        error: "Error al obtener datos",
      });
    }
  },
};
