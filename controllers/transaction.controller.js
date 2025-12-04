const { Transaction } = require("../models");

module.exports = {

  // Crear transacción (empleador paga, trabajador recibe)
  async crear(req, res) {
    try {
      const nueva = await Transaction.create({
        userId: req.body.userId,           // a quién va dirigido el dinero
        monto: req.body.monto,
        tipo: req.body.tipo,               // ingreso | gasto
        descripcion: req.body.descripcion,
        servicioId: req.body.servicioId
      });

      res.json(nueva);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error al crear transacción" });
    }
  },

  // Obtener mis transacciones según userId del token
  async misTransacciones(req, res) {
    try {
      const userId = req.user.id;

      const datos = await Transaction.findAll({
        where: { userId },
        order: [["createdAt", "DESC"]]
      });

      res.json(datos);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Error al obtener transacciones" });
    }
  },

  // (Opcional) Historial total para admin
  async todas(req, res) {
    try {
      const datos = await Transaction.findAll({
        order: [["createdAt", "DESC"]]
      });

      res.json(datos);
    } catch (e) {
      res.status(500).json({ error: "Error al obtener datos" });
    }
  }
};
