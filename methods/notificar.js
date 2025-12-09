const { Notificacion } = require("../models");

async function crearNotificacion(userId, titulo, mensaje) {
  if (!userId) return;

  return await Notificacion.create({
    userId,
    titulo,
    mensaje,
    leido: false,
  });
}

module.exports = {
  crearNotificacion,
};
