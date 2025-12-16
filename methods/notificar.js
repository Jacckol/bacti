"use strict";

const { Notificacion } = require("../models");

/**
 * Crear una notificación para un usuario.
 *
 * @param {number} userId - ID del usuario que recibirá la notificación.
 * @param {string} titulo - Título de la notificación.
 * @param {string} mensaje - Mensaje principal.
 * @param {object} dataExtra - Datos adicionales (postulante, trabajo, etc.) en formato JSON.
 * @returns {Promise<object|null>} - La notificación creada o null si falla.
 */
async function crearNotificacion(userId, titulo, mensaje, dataExtra = {}) {
  if (!userId) {
    console.warn("⚠️ crearNotificacion: userId no recibido");
    return null;
  }

  try {
    const nueva = await Notificacion.create({
      userId,
      titulo,
      mensaje,
      data: dataExtra, // 🔥 SE GUARDA JSON COMPLETO AQUÍ
      leido: false,
    });

    console.log("📩 Notificación creada:", nueva.id);

    return nueva;

  } catch (error) {
    console.error("❌ Error crearNotificacion:", error);
    return null;
  }
}

module.exports = {
  crearNotificacion,
};
